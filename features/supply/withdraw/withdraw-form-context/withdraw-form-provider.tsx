import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { Address } from 'viem';
import invariant from 'tiny-invariant';

import { useWithdrawable, useWithdraw } from 'features/supply/withdraw/hooks';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { WithdrawFormSchema } from 'features/supply/withdraw/types';

type WithdrawDataContextValue = {
  withdrawableAmount: bigint | undefined;
  isWithdrawableLoading: boolean;
  isWithdrawableSuccess: boolean;
  isWithdrawableError: boolean;
};

const WithdrawDataContext = createContext<WithdrawDataContextValue | null>(
  null,
);
WithdrawDataContext.displayName = 'WithdrawDataContext';

export const useWithdrawFormData = () => {
  const value = useContext(WithdrawDataContext);
  invariant(
    value,
    'useWithdrawFormData was used outside the WithdrawDataContext provider',
  );

  return value;
};

export const WithdrawFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const formObject = useForm<WithdrawFormSchema>({
    defaultValues: {
      amount: undefined,
      recipient: '' as Address,
    },
    mode: 'all',
    // TODO: add form validation
    reValidateMode: 'onChange',
  });
  const { withdraw, retryEvent } = useWithdraw();

  const {
    data: withdrawableAmount,
    isLoading: isWithdrawableLoading,
    isSuccess: isWithdrawableSuccess,
    isError: isWithdrawableError,
  } = useWithdrawable();

  const withdrawData = useMemo(
    () => ({
      withdrawableAmount,
      isWithdrawableLoading,
      isWithdrawableSuccess,
      isWithdrawableError,
    }),
    [
      withdrawableAmount,
      isWithdrawableLoading,
      isWithdrawableSuccess,
      isWithdrawableError,
    ],
  );

  const onSubmit = useCallback(
    async ({ amount, recipient }: WithdrawFormSchema) => {
      // TODO: add validation, remove stub
      if (!recipient || !amount) return false;
      invariant(
        amount,
        '[WithdrawFormProvider] withdrawableAmount is undefined',
      );
      invariant(recipient, '[WithdrawFormProvider] recipient is undefined');

      const { success } = await withdraw({ amount, recipient });

      return success;
    },
    [withdraw],
  );

  const formControllerValue: FormControllerContextValueType<WithdrawFormSchema> =
    useMemo(
      () => ({
        onSubmit,
        retryEvent,
        onReset: formObject.reset,
      }),
      [retryEvent, onSubmit, formObject.reset],
    );

  return (
    <WithdrawDataContext.Provider value={withdrawData}>
      <FormProvider {...formObject}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
        </FormControllerContext.Provider>
      </FormProvider>
    </WithdrawDataContext.Provider>
  );
};
