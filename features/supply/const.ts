import { LIDO_TOKENS } from '@lidofinance/lido-ethereum-sdk/common';

export const TOKENS_TO_MINT = {
  [LIDO_TOKENS.eth]: LIDO_TOKENS.eth,
  [LIDO_TOKENS.wsteth]: LIDO_TOKENS.wsteth,
  [LIDO_TOKENS.steth]: LIDO_TOKENS.steth,
} as const;

export type TOKENS_TO_MINT = keyof typeof TOKENS_TO_MINT;

export enum SUPPLY_PATHS {
  fund = 'fund',
  withdraw = 'withdraw',
}

export type SupplyPaths = (typeof SUPPLY_PATHS)[keyof typeof SUPPLY_PATHS];

export const supplyToggleList: { value: SupplyPaths; label: string }[] = [
  {
    value: SUPPLY_PATHS.fund,
    label: 'fund',
  },
  {
    value: SUPPLY_PATHS.withdraw,
    label: 'withdraw',
  },
];
