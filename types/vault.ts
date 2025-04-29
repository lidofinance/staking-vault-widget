import type { VaultHubAbi } from 'abi/vault-hub';
import type { VaultFactoryAbi } from 'abi/vault-factory';
import { Address, ReadContractReturnType, WriteContractParameters } from 'viem';

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

type FactoryParams = WriteContractParameters<
  typeof VaultFactoryAbi,
  'createVaultWithDashboard'
>['args'];

export type VaultFactoryArgs = {
  defaultAdmin: FactoryParams[0];
  nodeOperator: FactoryParams[1];
  nodeOperatorManager: FactoryParams[2];
  nodeOperatorFeeBP: FactoryParams[3];
  confirmExpiry: FactoryParams[4];
  roles: FactoryParams[5];
};
