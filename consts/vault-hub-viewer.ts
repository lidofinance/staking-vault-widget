import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

// TODO: discuss move to lido-locator
export const VAULT_HUB_VIEWER_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x',
  [CHAINS.Holesky]: '0x5D73Eec220C7428eEAa26aF0F6d65B4dD1bb95aA',
};

export const getVaultHubViewerAddress = (
  chainId: CHAINS,
): Address | undefined => VAULT_HUB_VIEWER_BY_NETWORK?.[chainId];
