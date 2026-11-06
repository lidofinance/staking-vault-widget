import { describe, test, expect, jest } from '@jest/globals';
import { encodeEventTopics, getAddress } from 'viem';
import type { Address, Hash, Hex, TransactionReceipt } from 'viem';
import { VaultFactoryAbi } from '@lidofinance/lido-ethereum-sdk/stvault';

// keep the test on pure logic, without app config and contracts
jest.unstable_mockModule('modules/vaults', () => ({
  VAULT_TOTAL_BASIS_POINTS: 10_000,
  VAULTS_CONNECT_DEPOSIT: 0n,
  VAULTS_ROOT_ROLES_MAP: {},
}));
jest.unstable_mockModule(
  'features/create-vault/create-vault-form/validation',
  () => ({ createVaultSchema: {} }),
);

const { parseVaultTx, getFallbackVaultList } = await import('../utils');
type Response = Parameters<typeof parseVaultTx>[0];

const address = (byte: string): Address => getAddress(`0x${byte.repeat(20)}`);
const hash = (byte: string): Hash => `0x${byte.repeat(32)}`;

const FACTORY = address('fa');
const OTHER_CONTRACT = address('fb');
const ADMIN = address('a1');
const OTHER_ADMIN = address('a2');
const VAULT = address('aa');
const OTHER_VAULT = address('bb');
const CONFIRMED_HASH = hash('11');
const WALLET_HASH = hash('22');

// the factory is configured in lowercase, the logs come checksummed
const expected = {
  factory: FACTORY.toLowerCase() as Address,
  defaultAdmin: ADMIN,
  owners: [ADMIN],
};

type TestLog = { address: Address; data: Hex; topics: Hex[] };

// VaultCreated + DashboardCreated, as the factory emits them for one vault
const createdLogs = (
  vault: Address,
  admin: Address,
  emitter: Address = FACTORY,
): TestLog[] => [
  {
    address: emitter,
    data: '0x',
    topics: encodeEventTopics({
      abi: VaultFactoryAbi,
      eventName: 'VaultCreated',
      args: { vault },
    }) as Hex[],
  },
  {
    address: emitter,
    data: '0x',
    topics: encodeEventTopics({
      abi: VaultFactoryAbi,
      eventName: 'DashboardCreated',
      args: { dashboard: address('dd'), vault, admin },
    }) as Hex[],
  },
];

const unrelatedLog: TestLog = {
  address: FACTORY,
  data: '0x',
  topics: [hash('33')],
};

// only the fields parseVaultTx reads
const legacyResponse = (logs: TestLog[]): Response => ({
  isAA: false,
  lastTxBlock: 1n,
  receipts: [
    { transactionHash: CONFIRMED_HASH, logs } as unknown as TransactionReceipt,
  ],
});

const walletReceipt = (transactionHash: Hash, logs: TestLog[]) => ({
  transactionHash,
  logs,
  status: 'success',
  blockHash: hash('44'),
  blockNumber: 1n,
  gasUsed: 1n,
});

// wallet receipts only: confirmations failed, so receipts is empty
const aaReceiptsResponse = (
  walletReceipts: ReturnType<typeof walletReceipt>[],
): Response =>
  ({
    isAA: true,
    lastTxBlock: 1n,
    receipts: [],
    callStatus: { receipts: walletReceipts },
  }) as unknown as Response;

const aaResponse = (logs: TestLog[] | null): Response =>
  aaReceiptsResponse(logs ? [walletReceipt(WALLET_HASH, logs)] : []);

describe('parseVaultTx', () => {
  test('reads the vault from a legacy receipt', () => {
    expect(
      parseVaultTx(legacyResponse(createdLogs(VAULT, ADMIN)), expected),
    ).toEqual({ vaultAddress: VAULT, txHash: CONFIRMED_HASH, reason: null });
  });

  test('AA without confirmed receipts falls back to the wallet receipts', () => {
    expect(
      parseVaultTx(aaResponse(createdLogs(VAULT, ADMIN)), expected),
    ).toEqual({ vaultAddress: VAULT, txHash: WALLET_HASH, reason: null });
  });

  test('AA without any receipts yields nothing', () => {
    expect(parseVaultTx(aaResponse(null), expected)).toEqual({
      vaultAddress: null,
      txHash: null,
      reason: 'no-receipts',
    });
  });

  test('receipt without vault events keeps the tx hash', () => {
    expect(parseVaultTx(legacyResponse([unrelatedLog]), expected)).toEqual({
      vaultAddress: null,
      txHash: CONFIRMED_HASH,
      reason: 'no-factory-events',
    });
  });

  test('ignores events emitted by another contract', () => {
    expect(
      parseVaultTx(
        aaResponse(createdLogs(OTHER_VAULT, ADMIN, OTHER_CONTRACT)),
        expected,
      ),
    ).toEqual({
      vaultAddress: null,
      txHash: WALLET_HASH,
      reason: 'no-factory-events',
    });
  });

  test("picks this form's vault among other users' vaults in the bundle", () => {
    expect(
      parseVaultTx(
        aaResponse([
          ...createdLogs(OTHER_VAULT, OTHER_ADMIN),
          ...createdLogs(VAULT, ADMIN),
        ]),
        expected,
      ),
    ).toEqual({ vaultAddress: VAULT, txHash: WALLET_HASH, reason: null });
  });

  test('ignores a vault of another admin', () => {
    expect(
      parseVaultTx(aaResponse(createdLogs(OTHER_VAULT, OTHER_ADMIN)), expected),
    ).toEqual({ vaultAddress: null, txHash: WALLET_HASH, reason: 'no-match' });
  });

  test('finds the vault in an earlier wallet receipt and keeps its hash', () => {
    expect(
      parseVaultTx(
        aaReceiptsResponse([
          walletReceipt(WALLET_HASH, createdLogs(VAULT, ADMIN)),
          walletReceipt(CONFIRMED_HASH, [unrelatedLog]),
        ]),
        expected,
      ),
    ).toEqual({ vaultAddress: VAULT, txHash: WALLET_HASH, reason: null });
  });

  test('without a match the last receipt hash is kept for the explorer link', () => {
    expect(
      parseVaultTx(
        aaReceiptsResponse([
          walletReceipt(WALLET_HASH, createdLogs(OTHER_VAULT, OTHER_ADMIN)),
          walletReceipt(CONFIRMED_HASH, [unrelatedLog]),
        ]),
        expected,
      ),
    ).toEqual({
      vaultAddress: null,
      txHash: CONFIRMED_HASH,
      reason: 'no-match',
    });
  });

  test('AA: the event in an earlier wallet receipt is found, not only in the confirmed last one', () => {
    // only the last wallet receipt is re-read with confirmations
    const response = {
      isAA: true,
      lastTxBlock: 1n,
      receipts: [{ transactionHash: CONFIRMED_HASH, logs: [unrelatedLog] }],
      callStatus: {
        receipts: [
          walletReceipt(WALLET_HASH, createdLogs(VAULT, ADMIN)),
          walletReceipt(CONFIRMED_HASH, [unrelatedLog]),
        ],
      },
    } as unknown as Response;

    expect(parseVaultTx(response, expected)).toEqual({
      vaultAddress: VAULT,
      txHash: WALLET_HASH,
      reason: null,
    });
  });

  test('AA: the same tx in wallet and confirmed receipts is counted once', () => {
    const logs = createdLogs(VAULT, ADMIN);
    const response = {
      isAA: true,
      lastTxBlock: 1n,
      receipts: [{ transactionHash: WALLET_HASH, logs }],
      callStatus: { receipts: [walletReceipt(WALLET_HASH, logs)] },
    } as unknown as Response;

    // not 'ambiguous'
    expect(parseVaultTx(response, expected)).toEqual({
      vaultAddress: VAULT,
      txHash: WALLET_HASH,
      reason: null,
    });
  });

  test('AA: a wallet receipt without logs does not hide the confirmed one with the event', () => {
    const response = {
      isAA: true,
      lastTxBlock: 1n,
      receipts: [
        { transactionHash: WALLET_HASH, logs: createdLogs(VAULT, ADMIN) },
      ],
      // some wallets return receipts without logs
      callStatus: { receipts: [walletReceipt(WALLET_HASH, [])] },
    } as unknown as Response;

    expect(parseVaultTx(response, expected)).toEqual({
      vaultAddress: VAULT,
      txHash: WALLET_HASH,
      reason: null,
    });
  });

  test('AA: the same tx with differently cased hashes is counted once', () => {
    const logs = createdLogs(VAULT, ADMIN);
    const lowerHash = hash('ab');
    const upperHash: Hash = `0x${'AB'.repeat(32)}`;
    const response = {
      isAA: true,
      lastTxBlock: 1n,
      receipts: [{ transactionHash: lowerHash, logs }],
      callStatus: { receipts: [walletReceipt(upperHash, logs)] },
    } as unknown as Response;

    // not 'ambiguous'
    expect(parseVaultTx(response, expected)).toEqual({
      vaultAddress: VAULT,
      txHash: lowerHash,
      reason: null,
    });
  });

  test("AA: malformed wallet receipts don't crash the result", () => {
    const response = {
      isAA: true,
      lastTxBlock: 1n,
      receipts: [
        { transactionHash: CONFIRMED_HASH, logs: createdLogs(VAULT, ADMIN) },
      ],
      callStatus: {
        receipts: [
          // no hash, no logs, a log without topics: wallet data is not validated
          { logs: createdLogs(OTHER_VAULT, ADMIN) },
          { transactionHash: WALLET_HASH },
          {
            transactionHash: hash('33'),
            logs: [{ address: FACTORY, data: '0x' }],
          },
          null,
        ],
      },
    } as unknown as Response;

    expect(parseVaultTx(response, expected)).toEqual({
      vaultAddress: VAULT,
      txHash: CONFIRMED_HASH,
      reason: null,
    });
  });

  test('skips a malformed log address from the wallet instead of throwing', () => {
    const malformed = {
      ...unrelatedLog,
      address: '0xnot-an-address' as Address,
    };
    expect(
      parseVaultTx(
        aaResponse([malformed, ...createdLogs(VAULT, ADMIN)]),
        expected,
      ),
    ).toEqual({ vaultAddress: VAULT, txHash: WALLET_HASH, reason: null });
  });

  test('two vaults for the same admin are ambiguous', () => {
    expect(
      parseVaultTx(
        aaResponse([
          ...createdLogs(VAULT, ADMIN),
          ...createdLogs(OTHER_VAULT, ADMIN),
        ]),
        expected,
      ),
    ).toEqual({ vaultAddress: null, txHash: WALLET_HASH, reason: 'ambiguous' });
  });
});

describe('getFallbackVaultList', () => {
  test('the connected owner finds the vault in My stVaults', () => {
    expect(getFallbackVaultList([ADMIN], ADMIN)).toBe('my');
  });

  test('any submitted owner counts, in any address case', () => {
    expect(
      getFallbackVaultList(
        [OTHER_ADMIN, ADMIN],
        ADMIN.toLowerCase() as Address,
      ),
    ).toBe('my');
  });

  test('a signer that set other owners is sent to All stVaults', () => {
    // My stVaults lists vaults of the connected address only
    expect(getFallbackVaultList([OTHER_ADMIN], ADMIN)).toBe('all');
  });

  test('unknown owners or no connection fall back to All stVaults', () => {
    expect(getFallbackVaultList(undefined, ADMIN)).toBe('all');
    expect(getFallbackVaultList([ADMIN], undefined)).toBe('all');
  });
});
