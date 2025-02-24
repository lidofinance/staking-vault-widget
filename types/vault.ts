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
