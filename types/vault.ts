import { Address } from 'viem';

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

export interface VaultSocket {
  isDisconnected: boolean;
  reserveRatioBP: number;
  rebalanceThresholdBP: number;
  shareLimit: bigint;
  sharesMinted: bigint;
  treasuryFeeBP: number;
  vault: Address;
}

export type VaultFactoryArgs = {
  defaultAdmin: Address;
  nodeOperatorManager: Address;
  assetRecoverer: Address;
  confirmExpiry: bigint;
  curatorFeeBP: number;
  nodeOperatorFeeBP: number;
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
