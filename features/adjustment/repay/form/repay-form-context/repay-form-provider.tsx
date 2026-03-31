import invariant from 'tiny-invariant';
import {
  useCallback,
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
} from 'react';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useDisableForm } from 'shared/hook-form';
import { FormControllerStyled } from 'shared/components/form';

import { useRepay } from './use-repay';
import { repayFormResolver } from './validation';
import { useRepayFormData } from './use-repay-form-data';

import type {
  RepayFormContextValue,
  RepayFormFieldValues,
  RepayFormValidatedValues,
  RepayFormValidationContextAwaitable,
} from '../types';

const RepayFormContext = createContext<RepayFormContextValue | null>(null);
RepayFormContext.displayName = 'RepayFormContext';

export const useRepayForm = () => {
  const value = useContext(RepayFormContext);
  invariant(
    value,
    'useRepayFormData was used outside the RepayFormContext provider',
  );

  return value;
};

export const RepayFormProvider = ({ children }: PropsWithChildren) => {
  const {
    invalidateRepayFormData,
    validationContext,
    isMaxRepayableLoading,
    maxRepayableStETH,
    maxRepayableWstETH,
  } = useRepayFormData();
  const { isDappActive } = useDappStatus();
  const disabled = useDisableForm();
  const { burn, retryEvent } = useRepay();

  const formObject = useForm<
    RepayFormFieldValues,
    RepayFormValidationContextAwaitable,
    RepayFormValidatedValues
  >({
    defaultValues: {
      amount: null,
      token: 'stETH',
    },
    mode: 'onTouched',
    context: validationContext,
    resolver: repayFormResolver,
    disabled: !isDappActive || disabled,
  });

  const token = formObject.watch('token');

  const onSubmit = useCallback(
    async (values: RepayFormValidatedValues) => {
      const success = await burn(values);
      await invalidateRepayFormData();
      return success;
    },
    [burn, invalidateRepayFormData],
  );

  const repayContextValue: RepayFormContextValue = useMemo(
    () => ({
      isMaxRepayableLoading,
      maxRepayable: token === 'stETH' ? maxRepayableStETH : maxRepayableWstETH,
    }),
    [isMaxRepayableLoading, maxRepayableStETH, maxRepayableWstETH, token],
  );

  return (
    <RepayFormContext.Provider value={repayContextValue}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
        data-testid="repayForm"
      >
        {children}
      </FormControllerStyled>
    </RepayFormContext.Provider>
  );
};
