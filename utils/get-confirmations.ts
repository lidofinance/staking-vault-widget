import { Abi, decodeFunctionData, Address, Hex, getContract } from 'viem';

import { type RegisteredPublicClient } from 'modules/web3';
import { confirmationAbi } from 'abi/confirmation-abi';

// Define argument types for each function
export type FunctionArgsMap = {
  setConfirmExpiry: readonly [bigint];
  setFeeRate: readonly [bigint];
  transferVaultOwnership: readonly [Address];
  changeTier: readonly [Address, bigint, bigint];
  updateVaultShareLimit: readonly [Address, bigint];
  syncTier: readonly [Address];
};
type FunctionName = keyof FunctionArgsMap;
type DecodedData<FN extends FunctionName = FunctionName> = {
  [K in FN]: {
    functionName: K;
    args: FunctionArgsMap[K];
  };
}[FN];

export type Confirmation<FN extends FunctionName = FunctionName> = {
  member: Address;
  roleOrAddress: Hex;
  expiryTimestamp: bigint;
  expiryDate: Date;
  data: Hex;
  decodedData: DecodedData<FN>;
};

const AVG_BLOCK_TIME_SEC = 12n;

export const getConfirmationsInfo = async <
  FN extends FunctionName = FunctionName,
>(
  address: Address,
  publicClient: RegisteredPublicClient,
  abi: Abi,
): Promise<{
  confirmations: Confirmation<FN>[];
  confirmationsCount: bigint[];
  confirmExpiry: bigint;
}> => {
  const contract = getContract({
    address,
    abi: confirmationAbi,
    client: { public: publicClient },
  });

  const [confirmExpiry, currentBlock] = await Promise.all([
    contract.read.getConfirmExpiry(),
    publicClient.getBlockNumber(),
  ]);

  const confirmExpireInBlocks = confirmExpiry / AVG_BLOCK_TIME_SEC;
  const fromBlock = currentBlock - confirmExpireInBlocks;

  const safeBlockSize = 10_000n; // safe for rpc calls
  const ranges: Array<Record<'fromBlock' | 'toBlock', bigint>> = [];

  for (let start = fromBlock; start <= currentBlock; start += safeBlockSize) {
    ranges.push({
      fromBlock: start,
      toBlock:
        start + safeBlockSize - 1n <= currentBlock
          ? start + safeBlockSize - 1n
          : currentBlock,
    });
  }

  // get all logs without filtering by role, because Operator Grid uses addresses instead of roles
  const logs = (
    await Promise.all(
      ranges.map(({ fromBlock, toBlock }) =>
        publicClient.getContractEvents({
          address: contract.address,
          abi: contract.abi,
          eventName: 'RoleMemberConfirmed',
          strict: true,
          fromBlock,
          toBlock,
        }),
      ),
    )
  ).flat();

  let confirmations = logs
    // filter out confirmations that are already expired
    .filter(
      ({ args }) =>
        args.confirmTimestamp &&
        args.confirmTimestamp + confirmExpiry > BigInt(Date.now()) / 1000n,
    )
    .map((log) => {
      const { confirmTimestamp, member, roleOrAddress, data } =
        log.args as Required<typeof log.args>;
      const expiryTimestamp = confirmTimestamp + confirmExpiry;

      return {
        member,
        roleOrAddress,
        expiryTimestamp,
        expiryDate: new Date(Number(expiryTimestamp) * 1000),
        data,
        decodedData: decodeFunctionData({
          abi,
          data,
        }) as DecodedData,
      };
    });

  // dedup proposals
  const dedupedMap = confirmations.reduce((dataMap, confirmation) => {
    const entry = dataMap.get(confirmation.data);

    if (!entry || entry.expiryTimestamp < confirmation.expiryTimestamp) {
      dataMap.set(confirmation.data, confirmation);
    }

    return dataMap;
  }, new Map<string, (typeof confirmations)[number]>());

  // sort by expiry timestamp
  confirmations = [...dedupedMap.values()].sort((a, b) =>
    Number(a.expiryTimestamp - b.expiryTimestamp),
  );

  // TODO: fix type with EncodableContract
  // get how many are active
  const confirmationsCount = (await publicClient.multicall({
    allowFailure: false,
    contracts: confirmations.map((confirmation) => ({
      address: contract.address,
      abi: contract.abi,
      functionName: 'confirmation',
      args: [confirmation.data, confirmation.roleOrAddress],
    })),
  })) as bigint[];

  // filter out inactive confirmations
  confirmations = confirmations.filter(
    (_, index) => confirmationsCount[index] > 0,
  );

  return {
    confirmations: confirmations as Confirmation<FN>[],
    confirmationsCount,
    confirmExpiry,
  };
};
