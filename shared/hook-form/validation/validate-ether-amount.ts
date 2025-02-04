import { maxUint256 } from 'viem';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { ValidationError } from './validation-error';
import { LIDO_TOKENS } from '@lidofinance/lido-ethereum-sdk/common';

export const TOKENS = {
  [LIDO_TOKENS.eth]: LIDO_TOKENS.eth,
  [LIDO_TOKENS.steth]: LIDO_TOKENS.steth,
  [LIDO_TOKENS.wsteth]: LIDO_TOKENS.wsteth,
} as const;

export type TOKENS = keyof typeof TOKENS;

// asserts only work with function declaration
// eslint-disable-next-line func-style
export function validateEtherAmount(
  field: string,
  amount: bigint | undefined | null,
  token: TOKENS,
): asserts amount is bigint {
  // also checks undefined
  if (amount == null) throw new ValidationError(field, '');

  if (amount <= 0n)
    throw new ValidationError(
      field,
      `Enter ${getTokenDisplayName(token)} ${field} greater than 0`,
    );

  if (amount > maxUint256)
    throw new ValidationError(
      field,
      `${getTokenDisplayName(token)} ${field} is not valid`,
    );
}
