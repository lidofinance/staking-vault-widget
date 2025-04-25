import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useState,
} from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Address, isAddress } from 'viem';
import invariant from 'tiny-invariant';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import {
  useWithdrawable,
  useWithdrawWithDashboard,
} from 'features/supply/withdraw/hooks';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import { SubmitModal } from 'shared/components';

import { WithdrawFormSchema } from 'features/supply/withdraw/types';
import {
  SubmitPayload,
  SubmitStep,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';

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
  const [submitStep, setSubmitStep] = useState<{
    step: SubmitStep;
    tx?: Address;
  }>(() => ({ step: SubmitStepEnum.edit }));
  const formObject = useForm<WithdrawFormSchema>({
    defaultValues: {
      amount: undefined,
      recipient: '' as Address,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callWithdraw } = useWithdrawWithDashboard();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const setModalState = useCallback((submitStep: SubmitPayload) => {
    setSubmitStep(submitStep);
  }, []);

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
      try {
        if (amount && recipient && isAddress(recipient)) {
          setModalState({ step: SubmitStepEnum.initiate });
          const tx = await callWithdraw({ amount, recipient, setModalState });
          setModalState({ step: SubmitStepEnum.success, tx });
          return true;
        }
      } catch (err) {
        if (
          err instanceof Error &&
          err.message.includes('User rejected the request')
        ) {
          setModalState({ step: SubmitStepEnum.reject });
        } else {
          setModalState({ step: SubmitStepEnum.error });
        }

        return false;
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <SubmitModal submitStep={submitStep} setModalState={setModalState} />
        </FormControllerContext.Provider>
      </FormProvider>
    </WithdrawDataContext.Provider>
  );
};
