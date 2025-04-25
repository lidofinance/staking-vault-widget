import {
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import invariant from 'tiny-invariant';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useBurn } from 'features/adjustment/repay/hooks';
import { useDappStatus, useStethBalance, useWstethBalance } from 'modules/web3';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { RepayFormSchema } from 'features/adjustment/repay/types';
import { SubmitModal } from 'features/adjustment/repay/submit-modal';
import { SubmitStep, SubmitStepEnum } from 'shared/transaction-modal/types';
import { Address } from 'viem';

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
  const [submitStep, setSubmitStep] = useState<{
    step: SubmitStep;
    tx?: Address;
  }>(() => ({ step: SubmitStepEnum.edit }));
  const formObject = useForm<RepayFormSchema>({
    defaultValues: {
      amount: undefined,
      token: 'stETH',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callBurn } = useBurn();
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

  const { retryEvent, retryFire } = useFormControllerRetry();
  const setModalState = useCallback(
    (submitStep: { step: SubmitStep; tx?: Address }) => {
      setSubmitStep(submitStep);
    },
    [],
  );

  const onSubmit = useCallback(
    async ({ amount, token }: RepayFormSchema) => {
      try {
        if (amount) {
          setModalState({ step: SubmitStepEnum.initiate });
          const tx = await callBurn({ amount, token, setModalState });
          setModalState({ step: SubmitStepEnum.success, tx });
          return true;
        }

        return false;
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes('User rejected the request')
        ) {
          setModalState({ step: SubmitStepEnum.reject });
        } else {
          setModalState({ step: SubmitStepEnum.error });
        }
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callBurn],
  );

  const formControllerValue: FormControllerContextValueType<RepayFormSchema> =
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
    <RepayDataContext.Provider value={repayData}>
      <FormProvider {...formObject}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
          <SubmitModal submitStep={submitStep} setModalState={setModalState} />
        </FormControllerContext.Provider>
      </FormProvider>
    </RepayDataContext.Provider>
  );
};
