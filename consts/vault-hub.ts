import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const VAULt_HUB_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x0B1dbaa8Ab31Fe48bCC13beFcF3D0b319Fa9a525',
  [CHAINS.Holesky]: '0x0B1dbaa8Ab31Fe48bCC13beFcF3D0b319Fa9a525',
};

export const getVaultHubAddress = (chainId: CHAINS): Address | undefined =>
  VAULt_HUB_BY_NETWORK?.[chainId];
