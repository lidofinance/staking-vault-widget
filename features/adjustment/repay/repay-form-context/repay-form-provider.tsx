import {
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { useBurn } from 'features/adjustment/repay/hooks';
import { useDappStatus, useStethBalance, useWstethBalance } from 'modules/web3';

import { FormController } from 'shared/hook-form/form-controller';

import { RepayFormSchema } from 'features/adjustment/repay/types';

type RepayDataContextValue = {
  stEthBalance: bigint | undefined;
  isStEthLoading: boolean;
  isStEthSuccess: boolean;
  isStEthError: boolean;
  wstEthBalance: bigint | undefined;
  isWstEthLoading: boolean;
  isWstEthSuccess: boolean;
  isWstEthError: boolean;
};

const RepayDataContext = createContext<RepayDataContextValue | null>(null);
RepayDataContext.displayName = 'RepayDataContext';

export const useRepayFormData = () => {
  const value = useContext(RepayDataContext);
  invariant(
    value,
    'useRepayFormData was used outside the RepayDataContext provider',
  );

  return value;
};

export const RepayFormProvider = ({ children }: { children: ReactNode }) => {
  const formObject = useForm<RepayFormSchema>({
    defaultValues: {
      amount: undefined,
      token: 'stETH',
    },
    mode: 'all',
    // TODO: validation
    reValidateMode: 'onChange',
  });
  const { burn, retryEvent } = useBurn();
  const { address } = useDappStatus();
  const {
    data: stEthBalance,
    isLoading: isStEthLoading,
    isSuccess: isStEthSuccess,
    isError: isStEthError,
  } = useStethBalance({ account: address });
  const {
    data: wstEthBalance,
    isLoading: isWstEthLoading,
    isSuccess: isWstEthSuccess,
    isError: isWstEthError,
  } = useWstethBalance({ account: address });

  const repayData = useMemo(
    () => ({
      stEthBalance,
      isStEthLoading,
      isStEthSuccess,
      isStEthError,
      wstEthBalance,
      isWstEthLoading,
      isWstEthSuccess,
      isWstEthError,
    }),
    [
      stEthBalance,
      isStEthLoading,
      isStEthSuccess,
      isStEthError,
      wstEthBalance,
      isWstEthLoading,
      isWstEthSuccess,
      isWstEthError,
    ],
  );

  const onSubmit = useCallback(
    async ({ amount, token }: RepayFormSchema) => {
      // TODO: add validation, remove stub
      if (!amount || !token) return false;

      invariant(amount, '[RepayFormProvider] amount is undefined');
      invariant(token, '[RepayFormProvider] token is undefined');

      return await burn(amount, token);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burn],
  );

  return (
    <RepayDataContext.Provider value={repayData}>
      <FormProvider {...formObject}>
        <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
          {children}
        </FormController>
      </FormProvider>
    </RepayDataContext.Provider>
  );
};
