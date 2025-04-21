import { VaultHubAbi } from 'abi/vault-hub';
import { Address, ReadContractReturnType } from 'viem';

export interface VaultInfo extends VaultSocket {
  address: Address;
  owner: Address;
  nodeOperator: Address;
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
}

export type VaultSocket = ReadContractReturnType<
  typeof VaultHubAbi,
  'vaultSocket',
  [Address]
>;

export type VaultFactoryArgs = {
  defaultAdmin: Address;
  nodeOperator: Address;
  nodeOperatorManager: Address;
  assetRecoverer: Address;
  confirmExpiry: bigint;
  curatorFeeBP: number;
  nodeOperatorFeeBP: bigint;
  funders: Address[];
  withdrawers: Address[];
  minters: Address[];
  burners: Address[];
  rebalancers: Address[];
  depositPausers: Address[];
  depositResumers: Address[];
  validatorExitRequesters: Address[];
  validatorWithdrawalTriggerers: Address[];
  disconnecters: Address[];
  curatorFeeSetters: Address[]; // TODO: Will be removed
  curatorFeeClaimers: Address[]; // TODO: Will be removed
  nodeOperatorFeeClaimers: Address[];
};
