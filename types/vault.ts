import type { VaultHubAbi } from 'abi/vault-hub';
import type { VaultFactoryAbi } from 'abi/vault-factory';
import { Address, ReadContractReturnType, WriteContractParameters } from 'viem';

export interface VaultInfo extends VaultSocket {
  address: Address;
  owner: Address;
  nodeOperator: Address;
  defaultAdmins: readonly Address[];
  nodeOperatorManagers: readonly Address[];
  valuation: bigint;
  minted: bigint;
  mintable: bigint;
  ethLimit: bigint;
  apr: null;
  healthScore: number;
  totalMintableShares: bigint;
  inOutDelta: bigint;
  locked: bigint;
  nodeOperatorUnclaimedFee: bigint;
  withdrawableEther: bigint;
  balance: bigint;
  nodeOperatorFeeBP: bigint;
  confirmExpiry: bigint;
}

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
