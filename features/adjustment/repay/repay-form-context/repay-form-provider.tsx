import { ReactNode, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useWithdrawWithDelegation } from 'modules/web3/hooks/use-withdraw-with-delegation';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { RepayFormSchema } from 'features/adjustment/repay/types';
import { isAddress } from 'viem';

export const RepayFormProvider = ({ children }: { children: ReactNode }) => {
  const formObject = useForm<RepayFormSchema>({
    defaultValues: {
      amount: null,
      recipient: null,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callWithdraw } = useWithdrawWithDelegation({});

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ amount, recipient }: RepayFormSchema) => {
      if (amount && recipient && isAddress(recipient)) {
        // TODO: resolve recipient if ens domain
        await callWithdraw('0xff', { amount, recipient });
        return true;
      }

      return false;
    },
    [callWithdraw],
  );

  const formControllerValue: FormControllerContextValueType<RepayFormSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        retryFire,
        onReset: formObject.reset,
      }),
      [retryFire, retryEvent, onSubmit, formObject.reset],
    );

  return (
    <FormProvider {...formObject}>
      <FormControllerContext.Provider value={formControllerValue}>
        <FormController>{children}</FormController>
      </FormControllerContext.Provider>
    </FormProvider>
  );
};
