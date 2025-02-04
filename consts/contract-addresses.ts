import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import type { Address } from 'viem';

export const STAKING_ROUTER_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0xFdDf38947aFB03C621C71b06C9C70bce73f12999',
  [CHAINS.Holesky]: '0xd6EbF043D30A7fe46D1Db32BA90a0A51207FE229',
  [CHAINS.Sepolia]: '0x4F36aAEb18Ab56A4e380241bea6ebF215b9cb12c',
};

export const getStakingRouterAddress = (
  chainId: CHAINS,
): Address | undefined => {
  return STAKING_ROUTER_BY_NETWORK[chainId] || undefined;
};
