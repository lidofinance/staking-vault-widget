import { Address } from 'viem';

export interface VaultInfo {
  address: Address | string;
  valuation: string;
  minted: string;
  mintable: string;
  APR: null;
  healthScore: string;
}
