import { Address } from 'viem';

export interface VaultInfo {
  address: Address;
  valuation: bigint;
  minted: bigint;
  mintable: bigint;
  apr: null;
  healthScore: number;
}

export interface VaultSocket {
  isDisconnected: boolean;
  reserveRatioBP: number;
  reserveRatioThresholdBP: number;
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
  curatorFeeSetters: Address[];
  curatorFeeClaimers: Address[];
  nodeOperatorFeeClaimers: Address[];
};
