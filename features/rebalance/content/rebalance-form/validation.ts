import z from 'zod';
import invariant from 'tiny-invariant';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Resolver } from 'react-hook-form';

import { awaitWithTimeout } from 'utils/await-with-timeout';
import { maxAmountSchema } from 'utils/zod-validation';

import type {
  RebalanceFormAwaitableValidationContext,
  RebalanceFormValidationContext,
  RebalanceFormFieldValues,
  RebalanceFormValidatedValues,
} from 'features/rebalance/types';

export const rebalanceFormSchema = (
  context: RebalanceFormValidationContext,
) => {
  const ethBalance = context?.balance ?? 0n;

  return z.object({
    isSupplyEth: z.boolean(),
    supplyEth: z.bigint(),
    rebalanceAmount: maxAmountSchema(ethBalance),
  });
};

export const RebalanceFormResolver: Resolver<
  RebalanceFormFieldValues,
  RebalanceFormAwaitableValidationContext,
  RebalanceFormValidatedValues
> = async (values, context, options) => {
  invariant(context, '[RebalanceFormResolver] context is undefined');
  const contextValue = await awaitWithTimeout(context, 4000);
  const schema = rebalanceFormSchema(contextValue);
  return zodResolver<
    RebalanceFormFieldValues,
    RebalanceFormAwaitableValidationContext,
    RebalanceFormValidatedValues
  >(schema as any)(values, context, options);
};
