import {
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useForm } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { useDappStatus, useStethBalance, useWstethBalance } from 'modules/web3';

import { useRepay } from './use-repay';
import { RepayFormSchema } from 'features/adjustment/repay/form/types';
import { FormControllerStyled } from 'shared/components/form';

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
  const { isDappActive } = useDappStatus();
  const formObject = useForm<RepayFormSchema>({
    defaultValues: {
      amount: undefined,
      token: 'stETH',
    },
    mode: 'all',
    disabled: !isDappActive,
    // TODO: validation
    reValidateMode: 'onChange',
  });
  const { burn, retryEvent } = useRepay();
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
      invariant(
        token === 'stETH' || token === 'wstETH',
        '[RepayFormProvider] token is invalid',
      );

      return await burn(amount, token);
    },
    [burn],
  );

  return (
    <RepayDataContext.Provider value={repayData}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
      >
        {children}
      </FormControllerStyled>
    </RepayDataContext.Provider>
  );
};
