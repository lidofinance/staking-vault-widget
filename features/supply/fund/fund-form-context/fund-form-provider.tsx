import { FC, ReactNode, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useFund } from 'features/supply/fund/hooks/use-fund';
import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { FundFormSchema } from 'features/supply/fund/types';

export const FundFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const formObject = useForm<FundFormSchema>({
    defaultValues: {
      amount: undefined,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callVaultFund } = useFund();

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ amount }: FundFormSchema) => {
      if (amount) {
        await callVaultFund(amount);
        return true;
      }

      return false;
    },
    [callVaultFund],
  );

  const formControllerValue: FormControllerContextValueType<FundFormSchema> =
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
