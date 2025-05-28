import type { VaultHubAbi } from 'abi/vault-hub';
import { Address, ReadContractReturnType } from 'viem';

export type VaultInfo = VaultSocket & {
  address: Address;
  owner: Address;
  nodeOperator: Address;
  defaultAdmins: readonly Address[];
  nodeOperatorManagers: readonly Address[];
  totalValue: bigint;
  liabilityStETH: bigint;
  mintableStETH: bigint;
  mintableShares: bigint;
  stETHLimit: bigint;
  apr: null;
  healthScore: number;
  totalMintingCapacity: bigint;
  totalMintingCapacityStETH: bigint;
  inOutDelta: bigint;
  locked: bigint;
  lockedShares: bigint;
  nodeOperatorUnclaimedFee: bigint;
  withdrawableEther: bigint;
  balance: bigint;
  nodeOperatorFeeBP: bigint;
  confirmExpiry: bigint;
};

export type VaultSocket = ReadContractReturnType<
  typeof VaultHubAbi,
  'vaultSocket',
  [Address]
>;
