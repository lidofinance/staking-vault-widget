import { FC, ReactNode, useMemo, useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useFundWithDashboard } from 'features/supply/fund/hooks/use-fund-with-dashboard';
import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';
import {
  FundFormSchema,
  SubmitStep,
  SubmitStepEnum,
} from 'features/supply/fund/types';
import { SubmitModal } from '../submit-modal';
import { Address } from 'viem';

export const FundFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [submitStep, setSubmitStep] = useState<{
    step: SubmitStep;
    tx?: Address;
  }>(() => ({ step: SubmitStepEnum.edit }));
  const formObject = useForm<FundFormSchema>({
    defaultValues: {
      amount: undefined,
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callVaultFund } = useFundWithDashboard();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const setModalState = useCallback(
    (submitStep: { step: SubmitStep; tx?: Address }) => {
      setSubmitStep(submitStep);
    },
    [],
  );

  const onSubmit = useCallback(
    async ({ amount }: FundFormSchema) => {
      try {
        if (amount) {
          setModalState({ step: SubmitStepEnum.initiate });
          const tx = await callVaultFund(amount, setModalState);
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
    [callVaultFund],
  );

  const formControllerValue: FormControllerContextValueType<FundFormSchema> =
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
    <FormProvider {...formObject}>
      <FormControllerContext.Provider value={formControllerValue}>
        <FormController>{children}</FormController>
        <SubmitModal submitStep={submitStep} setModalState={setModalState} />
      </FormControllerContext.Provider>
    </FormProvider>
  );
};
