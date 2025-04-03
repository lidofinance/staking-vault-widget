import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Address, isAddress } from 'viem';
import invariant from 'tiny-invariant';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { WithdrawFormSchema } from 'features/supply/withdraw/types';
import {
  useWithdrawable,
  useWithdrawWithDelegation,
} from 'features/supply/withdraw/hooks';

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
      token: 'ETH',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callWithdraw } = useWithdrawWithDelegation();
  const { retryEvent, retryFire } = useFormControllerRetry();

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
    async ({ amount, recipient, token }: WithdrawFormSchema) => {
      try {
        if (amount && recipient && isAddress(recipient)) {
          await callWithdraw({ amount, recipient, token });
          return true;
        }
      } catch (e) {
        return false;
      }

      return false;
    },
    [callWithdraw],
  );

  const formControllerValue: FormControllerContextValueType<WithdrawFormSchema> =
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
    <WithdrawDataContext.Provider value={withdrawData}>
      <FormProvider {...formObject}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
        </FormControllerContext.Provider>
      </FormProvider>
    </WithdrawDataContext.Provider>
  );
};
