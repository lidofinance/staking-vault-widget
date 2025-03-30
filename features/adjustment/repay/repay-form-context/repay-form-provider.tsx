import { ReactNode, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useBurnWithDelegation } from 'modules/web3/hooks/use-burn-with-delegation';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { RepayFormSchema } from 'features/adjustment/repay/types';

export const RepayFormProvider = ({ children }: { children: ReactNode }) => {
  const formObject = useForm<RepayFormSchema>({
    defaultValues: {
      amount: null,
      token: 'steth',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callBurn } = useBurnWithDelegation();

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ amount, token }: RepayFormSchema) => {
      if (amount) {
        // TODO: resolve recipient if ens domain
        await callBurn('0xff', { amount, token });
        return true;
      }

      return false;
    },
    [callBurn],
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
