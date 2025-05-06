import { FC, ReactNode, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFund } from 'features/supply/fund/hooks/use-fund';
import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { FundFormSchema } from 'features/supply/fund/types';
import invariant from 'tiny-invariant';

export const FundFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const formObject = useForm<FundFormSchema>({
    defaultValues: {
      amount: undefined,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });

  const { fund, retryFire } = useFund();

  const onSubmit = useCallback(
    async ({ amount }: FundFormSchema) => {
      invariant(amount, '[FundFormProvider] amount is undefined');
      return fund(amount);
    },
    [fund],
  );

  const formControllerValue: FormControllerContextValueType<FundFormSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryFire,
        onReset: formObject.reset,
      }),
      [retryFire, onSubmit, formObject.reset],
    );

  return (
    <FormProvider {...formObject}>
      <FormControllerContext.Provider value={formControllerValue}>
        <FormController>{children}</FormController>
      </FormControllerContext.Provider>
    </FormProvider>
  );
};
