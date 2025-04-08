import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const VAULT_FACTORY_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Sepolia]: '0xcD42e7505060b9931DD1B5B56C923b55f2D17561',
};

export const getVaultFactoryAddress = (chainId: CHAINS): Address | undefined =>
  VAULT_FACTORY_BY_NETWORK?.[chainId];
