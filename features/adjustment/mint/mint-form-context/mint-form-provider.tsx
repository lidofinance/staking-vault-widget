import { FC, ReactNode, useMemo, useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { MintFormSchema } from 'features/adjustment/mint/types';
import { useFundWithDelegation } from 'modules/web3/hooks/use-fund-with-delegation';

export const MintFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const formObject = useForm<MintFormSchema>({
    defaultValues: {
      amount: null,
      token: 'ETH',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callFund } = useFundWithDelegation({});

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ amount }: MintFormSchema) => {
      if (amount) {
        await callFund('0xff', amount);
        return true;
      }

      return false;
    },
    [callFund],
  );

  const formControllerValue: FormControllerContextValueType<MintFormSchema> =
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
