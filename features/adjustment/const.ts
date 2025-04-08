import { LIDO_TOKENS } from '@lidofinance/lido-ethereum-sdk/common';

export const TOKENS_TO_MINT = {
  [LIDO_TOKENS.steth]: LIDO_TOKENS.steth,
  [LIDO_TOKENS.wsteth]: LIDO_TOKENS.wsteth,
} as const;

export type TOKENS_TO_MINT = keyof typeof TOKENS_TO_MINT;

export enum ADJUSTMENT_PATHS {
  mint = 'mint',
  repay = 'repay',
}

export type AdjustmentPaths = 'mint' | 'repay';

export const adjustmentToggleList: { value: AdjustmentPaths; label: string }[] =
  [
    {
      value: ADJUSTMENT_PATHS.mint,
      label: 'mint',
    },
    {
      value: ADJUSTMENT_PATHS.repay,
      label: 'repay',
    },
  ];
