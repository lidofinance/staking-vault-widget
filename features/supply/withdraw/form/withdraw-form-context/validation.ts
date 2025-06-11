import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import {
  maxAmountSchema,
  supplyTokenSchema,
  validateRecipientSchema,
} from 'utils/validate-form-value';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import type {
  WithdrawFormFieldValues,
  WithdrawFormValidatedValues,
  WithdrawFormValidationContext,
  WithdrawFormValidationContextAwaitable,
} from '../types';

export const WithdrawFormSchema = ({
  validateRecipientArgs,
  withdrawableEther,
}: WithdrawFormValidationContext) => {
  return z.object({
    amount: maxAmountSchema(withdrawableEther),
    token: supplyTokenSchema,
    recipient: validateRecipientSchema(validateRecipientArgs),
  });
};

export const withdrawFormResolver: Resolver<
  WithdrawFormFieldValues,
  WithdrawFormValidationContextAwaitable,
  WithdrawFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[WithdrawFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);

  const schema = WithdrawFormSchema(contextValue);

  return zodResolver(schema)(values, contextValue, options);
};
