import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { useForm } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { useDappStatus } from 'modules/web3';

import { FormControllerStyled } from 'shared/components/form';
import { useWithdraw } from 'features/funding/withdraw/form/hooks';

import { withdrawFormResolver } from './validation';

import type {
  WithdrawFormData,
  WithdrawFormFieldValues,
  WithdrawFormValidatedValues,
  WithdrawFormValidationContextAwaitable,
} from 'features/funding/withdraw/form/types';
import { useWithdrawValidationContext } from './use-withdraw-validation-context';

const WithdrawDataContext = createContext<WithdrawFormData | null>(null);
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
  const { isDappActive } = useDappStatus();
  const { withdraw, retryEvent } = useWithdraw();
  const {
    validationContext,
    withdrawableEtherQuery,
    invalidateWithdrawFormData,
  } = useWithdrawValidationContext();

  const formObject = useForm<
    WithdrawFormFieldValues,
    WithdrawFormValidationContextAwaitable,
    WithdrawFormValidatedValues
  >({
    defaultValues: {
      amount: null,
      token: 'ETH',
      recipient: '',
    },
    mode: 'onTouched',
    disabled: !isDappActive,
    context: validationContext,
    resolver: withdrawFormResolver,
  });

  const onSubmit = useCallback(
    async (values: WithdrawFormValidatedValues) => {
      const success = await withdraw(values);
      // partial state change is possible here
      await invalidateWithdrawFormData();
      return success;
    },
    [invalidateWithdrawFormData, withdraw],
  );

  const withdrawDataContextValue = useMemo(
    () => ({ withdrawableEtherQuery }),
    [withdrawableEtherQuery],
  );

  return (
    <WithdrawDataContext.Provider value={withdrawDataContextValue}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
      >
        {children}
      </FormControllerStyled>
    </WithdrawDataContext.Provider>
  );
};
