import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const VAULT_VIEWER_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x',
  [CHAINS.Sepolia]: '0xF124672D263BB6e7A5B5cbcF8e6F39b4F6cbe582',
};

export const getVaultViewerAddress = (chainId: CHAINS): Address | undefined =>
  VAULT_VIEWER_BY_NETWORK?.[chainId];

export const VAULTS_PER_PAGE = 4;
