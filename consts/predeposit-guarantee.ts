import type { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

export const PRE_DEPOSIT_GUARANTEE_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Mainnet]: '0x',
  [CHAINS.Sepolia]: '0x935b089d9a4F1789783C3db0F466817bB4c9Ac16',
};

export const getPreDepositGuaranteeAddress = (
  chainId: CHAINS,
): Address | undefined => PRE_DEPOSIT_GUARANTEE_BY_NETWORK?.[chainId];
