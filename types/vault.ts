import { Address } from 'viem';

export interface VaultInfo {
  address: Address | string;
  valuation: bigint;
  minted: bigint;
  mintable: bigint;
  APR: null;
  healthScore: number;
}
