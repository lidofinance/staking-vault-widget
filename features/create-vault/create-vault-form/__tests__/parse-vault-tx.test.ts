import { encodeEventTopics, type Address, type Hex } from 'viem';
import { VaultFactoryAbi } from '@lidofinance/lido-ethereum-sdk/stvault';

import type { TransactionResponse } from 'modules/web3';
import { parseVaultTx } from '../parse-vault-tx';

const FACTORY: Address = '0x1111111111111111111111111111111111111111';
const OTHER_EMITTER: Address = '0x2222222222222222222222222222222222222222';
const OUR_VAULT: Address = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
const FOREIGN_VAULT: Address = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const TX_HASH: Hex = `0x${'ab'.repeat(32)}`;

const vaultCreatedLog = (vault: Address, emitter: Address = FACTORY) => ({
  address: emitter,
  data: '0x' as Hex,
  topics: encodeEventTopics({
    abi: VaultFactoryAbi,
    eventName: 'VaultCreated',
    args: { vault },
  }) as [Hex, ...Hex[]],
});

type TestLog = ReturnType<typeof vaultCreatedLog>;

const receipt = (logs: TestLog[]) => ({
  transactionHash: TX_HASH,
  blockNumber: 1n,
  logs,
});

const legacyResult = (logs: TestLog[]) =>
  ({
    isAA: false,
    lastTxBlock: 1n,
    receipts: [receipt(logs)],
  }) as unknown as TransactionResponse;

const aaResult = (fullLogs: TestLog[], scopedLogs: TestLog[][]) =>
  ({
    isAA: true,
    lastTxBlock: 1n,
    receipts: [receipt(fullLogs)],
    callStatus: {
      status: 'success',
      receipts: scopedLogs.map((logs) => receipt(logs)),
    },
  }) as unknown as TransactionResponse;

const lower = (value: string | null) => value?.toLowerCase() ?? null;

describe('parseVaultTx', () => {
  it('legacy: returns the single VaultCreated emitted by the factory', () => {
    const result = parseVaultTx(
      legacyResult([vaultCreatedLog(OUR_VAULT)]),
      FACTORY,
    );
    expect(lower(result.vaultAddress)).toBe(OUR_VAULT.toLowerCase());
    expect(result.txHash).toBe(TX_HASH);
  });

  it('AA: ignores foreign events in the bundle receipt and uses scoped logs', () => {
    const result = parseVaultTx(
      aaResult(
        [vaultCreatedLog(FOREIGN_VAULT), vaultCreatedLog(OUR_VAULT)],
        [[vaultCreatedLog(OUR_VAULT)]],
      ),
      FACTORY,
    );
    expect(lower(result.vaultAddress)).toBe(OUR_VAULT.toLowerCase());
    expect(result.txHash).toBe(TX_HASH);
  });

  it('ignores VaultCreated events from a non-factory emitter', () => {
    const result = parseVaultTx(
      legacyResult([vaultCreatedLog(FOREIGN_VAULT, OTHER_EMITTER)]),
      FACTORY,
    );
    expect(result.vaultAddress).toBeNull();
    expect(result.txHash).toBe(TX_HASH);
  });

  it('returns null when scoped logs hold more than one factory event', () => {
    const result = parseVaultTx(
      aaResult(
        [vaultCreatedLog(OUR_VAULT)],
        [[vaultCreatedLog(OUR_VAULT)], [vaultCreatedLog(FOREIGN_VAULT)]],
      ),
      FACTORY,
    );
    expect(result.vaultAddress).toBeNull();
    expect(result.txHash).toBe(TX_HASH);
  });

  it('returns null vault but keeps txHash when there are no events', () => {
    const result = parseVaultTx(legacyResult([]), FACTORY);
    expect(result.vaultAddress).toBeNull();
    expect(result.txHash).toBe(TX_HASH);
  });

  it('returns null vault when the factory address is unknown', () => {
    const result = parseVaultTx(
      legacyResult([vaultCreatedLog(OUR_VAULT)]),
      undefined,
    );
    expect(result.vaultAddress).toBeNull();
    expect(result.txHash).toBe(TX_HASH);
  });
});
