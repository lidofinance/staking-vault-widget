import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const VAULT_HUB_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x',
  [CHAINS.Sepolia]: '0x33532749B2e74CE7e4e222a70Df89b7a1523AF67',
};

export const getVaultHubAddress = (chainId: CHAINS): Address | undefined =>
  VAULT_HUB_BY_NETWORK?.[chainId];

export const VAULT_TOTAL_BASIS_POINTS = 100_00;
