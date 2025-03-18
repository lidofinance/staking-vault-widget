import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const VAULT_HUB_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x',
  [CHAINS.Sepolia]: '0x699009AFFE51215eF7EA1Cd1e51f2750177d6055',
};

export const getVaultHubAddress = (chainId: CHAINS): Address | undefined =>
  VAULT_HUB_BY_NETWORK?.[chainId];

export const VAULT_TOTAL_BASIS_POINTS = 100_00;
