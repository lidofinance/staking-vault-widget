import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
  useState,
} from 'react';
import { Address, isAddress, ReadContractErrorType } from 'viem';
import { useReadContract } from 'wagmi';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useClaimDashboard } from 'features/claim/claim-form/hooks';
import { useVaultInfo } from 'features/overview/contexts';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { dashboardAbi } from 'abi/dashboard-abi';
import { ClaimFormSchema } from 'features/claim/claim-form/types';
import invariant from 'tiny-invariant';
import { SubmitStep, SubmitStepEnum } from 'shared/transaction-modal/types';
import { SubmitModal } from '../submit-modal';

type ClaimDataContextValue = {
  availableToClaim: bigint | undefined;
  isLoadingClaimInfo: boolean;
  isErrorClaimInfo: boolean;
  errorClaimInfo: ReadContractErrorType | null;
};

const ClaimDataContext = createContext<ClaimDataContextValue | null>(null);
ClaimDataContext.displayName = 'ClaimDataContext';

export const useClaimFormData = () => {
  const value = useContext(ClaimDataContext);
  invariant(
    value,
    'useClaimFormData was used outside the ClaimDataContext provider',
  );

  return value;
};

export const ClaimFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [submitStep, setSubmitStep] = useState<{
    step: SubmitStep;
    tx?: Address;
  }>(() => ({ step: SubmitStepEnum.edit }));
  const { activeVault } = useVaultInfo();

  const {
    data: availableToClaim,
    isFetching: isLoadingClaimInfo,
    isError: isErrorClaimInfo,
    error: errorClaimInfo,
  } = useReadContract({
    abi: dashboardAbi,
    address: activeVault?.owner,
    functionName: 'nodeOperatorUnclaimedFee',
    query: {
      enabled: !!activeVault?.owner,
    },
  });

  const claimInfo = useMemo(
    () => ({
      availableToClaim,
      isLoadingClaimInfo,
      isErrorClaimInfo,
      errorClaimInfo,
    }),
    [availableToClaim, isLoadingClaimInfo, isErrorClaimInfo, errorClaimInfo],
  );

  const formObject = useForm<ClaimFormSchema>({
    defaultValues: {
      recipient: '',
    },
    mode: 'all',
    reValidateMode: 'onBlur',
  });

  const { callClaim } = useClaimDashboard();
  const { retryEvent, retryFire } = useFormControllerRetry();
  const setModalState = useCallback(
    (submitStep: { step: SubmitStep; tx?: Address }) => {
      setSubmitStep(submitStep);
    },
    [],
  );

  const onSubmit = useCallback(
    async ({ recipient }: ClaimFormSchema) => {
      if (recipient && isAddress(recipient)) {
        try {
          setModalState({ step: SubmitStepEnum.initiate });
          const tx = await callClaim(recipient, setModalState);
          setModalState({ step: SubmitStepEnum.success, tx });
          return true;
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
      }

      return false;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [callClaim],
  );

  const formControllerValue: FormControllerContextValueType<ClaimFormSchema> =
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
    <ClaimDataContext.Provider value={claimInfo}>
      <FormProvider {...formObject}>
        <FormControllerContext.Provider value={formControllerValue}>
          <FormController>{children}</FormController>
          <SubmitModal submitStep={submitStep} setModalState={setModalState} />
        </FormControllerContext.Provider>
      </FormProvider>
    </ClaimDataContext.Provider>
  );
};
