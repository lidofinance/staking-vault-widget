import { Abi, decodeFunctionData, Address, Hex, getContract } from 'viem';

import { type RegisteredPublicClient } from 'modules/web3';
import { confirmationAbi } from 'abi/confirmation-abi';

// Define argument types for each function
export type FunctionArgsMap = {
  setConfirmExpiry: readonly [bigint];
  setFeeRate: readonly [bigint];
  changeTier: readonly [Address, bigint, bigint];
  transferVaultOwnership: readonly [Address];
  updateVaultShareLimit: readonly [Address, bigint];
};
type FunctionName = keyof FunctionArgsMap;
type DecodedData = {
  [K in FunctionName]: {
    functionName: K;
    args: FunctionArgsMap[K];
  };
}[FunctionName];

export type Confirmation = {
  member: Address;
  roleOrAddress: Hex;
  expiryTimestamp: bigint;
  expiryDate: Date;
  data: Hex;
  decodedData: DecodedData;
};

const AVG_BLOCK_TIME_SEC = 12n;

export const getConfirmationsInfo = async (
  address: Address,
  publicClient: RegisteredPublicClient,
  abi: Abi,
): Promise<{
  confirmations: Confirmation[];
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

  // get all logs without filtering by role, because Operator Grid uses addresses instead of roles
  const logs = await publicClient.getContractEvents({
    address: contract.address,
    abi: contract.abi,
    eventName: 'RoleMemberConfirmed',
    fromBlock,
    strict: true,
  });

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
          data: data,
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
    confirmations,
    confirmationsCount,
    confirmExpiry,
  };
};
