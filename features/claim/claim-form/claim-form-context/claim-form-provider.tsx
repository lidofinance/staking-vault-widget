import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { Address, isAddress } from 'viem';
import { useReadContract } from 'wagmi';
import { FormProvider, useForm } from 'react-hook-form';

import { useFormControllerRetry } from 'shared/hook-form/form-controller/use-form-controller-retry-delegate';
import { useClaimWithDelegation } from 'features/claim/claim-form/hooks';
import { useVaultInfo } from 'features/overview/contexts';

import {
  FormController,
  FormControllerContext,
  FormControllerContextValueType,
} from 'shared/hook-form/form-controller';

import { DelegationAbi } from 'abi/delegation';
import { ClaimFormSchema } from 'features/claim/claim-form/types';
import invariant from 'tiny-invariant';

type ClaimDataContextValue = {
  availableToClaim: bigint | undefined;
  isLoadingClaimInfo: boolean;
  isErrorClaimInfo: boolean;
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
  const { activeVault } = useVaultInfo();

  const {
    data: availableToClaim,
    isFetching: isLoadingClaimInfo,
    isError: isErrorClaimInfo,
  } = useReadContract({
    abi: DelegationAbi,
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
    }),
    [availableToClaim, isLoadingClaimInfo, isErrorClaimInfo],
  );

  const formObject = useForm<ClaimFormSchema>({
    defaultValues: {
      recipient: '',
    },
    mode: 'all',
    reValidateMode: 'onChange',
  });
  const { callClaim } = useClaimWithDelegation();

  const { retryEvent, retryFire } = useFormControllerRetry();

  const onSubmit = useCallback(
    async ({ recipient }: ClaimFormSchema) => {
      if (isAddress(recipient as string)) {
        // TODO: resolve recipient if ens domain
        await callClaim(recipient as Address);
        return true;
      }

      return false;
    },
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
        </FormControllerContext.Provider>
      </FormProvider>
    </ClaimDataContext.Provider>
  );
};
