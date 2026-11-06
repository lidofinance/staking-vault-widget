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
import { useVault } from 'modules/vaults';
import { useDisableForm } from 'shared/hook-form';
import { FormControllerStyled } from 'shared/components/form';
import { useWithdraw } from 'features/funding/withdraw/form/hooks';

import { createWithdrawFormResolver } from './validation';
import {
  getWithdrawResumeKey,
  skipsWithdrawableCheck,
} from './withdraw-resume';

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
  const { withdraw, retryEvent, getCompletedSteps } = useWithdraw();
  const { activeVault } = useVault();
  // resume after a confirmed withdraw: validated as the resubmit sends (only the wrap)
  const withdrawResolver = useMemo(
    () =>
      createWithdrawFormResolver(
        (values) =>
          !!activeVault &&
          skipsWithdrawableCheck(
            getCompletedSteps(
              getWithdrawResumeKey(activeVault.address, values),
            ),
          ),
      ),
    [activeVault, getCompletedSteps],
  );
  const {
    validationContext,
    withdrawableEtherQuery,
    invalidateWithdrawFormData,
  } = useWithdrawValidationContext();
  const disabled = useDisableForm();

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
    disabled: !isDappActive || disabled,
    context: validationContext,
    resolver: withdrawResolver,
  });
  const { reset, watch } = formObject;
  const [amount, recipient, token] = watch(['amount', 'recipient', 'token']);
  const isWithdrawn =
    !!activeVault &&
    skipsWithdrawableCheck(
      getCompletedSteps(
        getWithdrawResumeKey(activeVault.address, { amount, recipient, token }),
      ),
    );

  const onSubmit = useCallback(
    async (values: WithdrawFormValidatedValues) => {
      const { success, isAborted } = await withdraw(values);
      // partial state change is possible here
      await invalidateWithdrawFormData();
      // the same values would send the confirmed steps again, so the user starts from an empty form
      if (isAborted) reset();
      return success;
    },
    [invalidateWithdrawFormData, reset, withdraw],
  );

  const withdrawDataContextValue = useMemo(
    () => ({ withdrawableEtherQuery, isWithdrawn }),
    [withdrawableEtherQuery, isWithdrawn],
  );

  return (
    <WithdrawDataContext.Provider value={withdrawDataContextValue}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
        data-testid="withdrawForm"
      >
        {children}
      </FormControllerStyled>
    </WithdrawDataContext.Provider>
  );
};
