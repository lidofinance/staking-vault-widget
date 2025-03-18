import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const VAULT_FACTORY_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x',
  [CHAINS.Sepolia]: '0x19987F920b9531c0b8d71D2BFE97594Cc83af185',
};

export const getVaultFactoryAddress = (chainId: CHAINS): Address | undefined =>
  VAULT_FACTORY_BY_NETWORK?.[chainId];
