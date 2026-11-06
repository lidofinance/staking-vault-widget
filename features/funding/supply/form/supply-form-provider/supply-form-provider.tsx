import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormControllerStyled } from 'shared/components/form';
import { useDisableForm } from 'shared/hook-form';
import {
  verificationConfirmDefaultValues,
  useDisableFormByVerification,
} from 'shared/components/banners/additional-verification';

import { createSupplyFormResolver } from './validation';
import { getSupplyResumeState, shouldTurnOffMint } from './supply-resume';
import {
  useSupply,
  useSupplyCompletedSteps,
  useSupplyFormValidationContext,
  useSupplyFormData,
} from './hooks';
import {
  SupplyFormData,
  SupplyFormDataAwaitableValidationContext,
  SupplyFormFieldValues,
  SupplyFormValidatedValues,
} from '../types';

// Context for sharing relevant form data
const SupplyFormDataContext = createContext<SupplyFormData | null>(null);
SupplyFormDataContext.displayName = 'SupplyFormDataContext';

export const useSupplyForm = () => {
  const context = useContext(SupplyFormDataContext);
  invariant(
    context,
    '[useSupplyForm] useSupplyForm must be used within a SupplyFormProvider',
  );
  return context;
};

export const SupplyFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDappActive } = useDappStatus();
  const { validationContext } = useSupplyFormValidationContext();
  const { supply, retryEvent, getCompletedSteps } = useSupply();
  // resume after a confirmed unwrap/fund: the form validates and quotes what a resubmit sends
  const getSupplyCompletedSteps = useSupplyCompletedSteps(getCompletedSteps);
  const supplyResolver = useMemo(
    () =>
      createSupplyFormResolver(
        (values) =>
          getSupplyResumeState(getSupplyCompletedSteps(values)).balanceCheck,
      ),
    [getSupplyCompletedSteps],
  );
  const disabled = useDisableForm();
  const isDisabledByVerification = useDisableFormByVerification('supply');

  const formObject = useForm<
    SupplyFormFieldValues,
    SupplyFormDataAwaitableValidationContext,
    SupplyFormValidatedValues
  >({
    defaultValues: {
      token: 'ETH',
      amount: null,
      mintSteth: false,
      mintAddress: '',
      ...verificationConfirmDefaultValues,
    },
    mode: 'onTouched',
    disabled: !isDappActive || disabled || isDisabledByVerification,
    context: useAwaiter(validationContext).awaiter,
    resolver: supplyResolver,
  });

  const { watch, reset, resetField } = formObject;
  const [mintSteth, amount, token, mintAddress] = watch([
    'mintSteth',
    'amount',
    'token',
    'mintAddress',
  ]);
  const completedSteps = getSupplyCompletedSteps({
    amount,
    mintSteth,
    token,
    mintAddress,
  });
  const supplyFormData = useSupplyFormData(
    token,
    mintSteth,
    amount,
    completedSteps,
  );
  const invalidateSupplyFormData = supplyFormData.invalidateSupplyFormData;
  const isStethMintable = supplyFormData.isStethMintableQuery.data === true;
  const { isFunded } = supplyFormData;

  useEffect(() => {
    // reset mintSteth  when stETH is not mintable (kept on a resume after a confirmed fund)
    if (shouldTurnOffMint({ mintSteth, isStethMintable, isFunded })) {
      resetField('mintSteth');
    }
    // reset mintAddress when mintSteth=false
    if (!mintSteth) {
      resetField('mintAddress');
    }
  }, [isFunded, isStethMintable, mintSteth, resetField]);

  const onSubmit = useCallback(
    async (values: SupplyFormValidatedValues) => {
      const { success, isAborted } = await supply(values);
      // revalidate form data because some TXs may have changed the state;
      // after a failure the balances are awaited, so a Retry validates against them
      await invalidateSupplyFormData({ awaitBalances: !success });
      // the same values would send the confirmed steps again, so the user starts from an empty form
      if (isAborted) reset();

      return success;
    },
    [invalidateSupplyFormData, reset, supply],
  );

  return (
    <SupplyFormDataContext.Provider value={supplyFormData}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
        data-testid="supplyForm"
      >
        {children}
      </FormControllerStyled>
    </SupplyFormDataContext.Provider>
  );
};
