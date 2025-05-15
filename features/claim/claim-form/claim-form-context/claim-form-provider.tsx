import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import { isAddress, ReadContractErrorType } from 'viem';
import { useReadContract } from 'wagmi';
import { FormProvider, useForm } from 'react-hook-form';

import { useClaim } from 'features/claim/claim-form/hooks';
import { useVaultInfo } from 'modules/vaults';

import { FormController } from 'shared/hook-form/form-controller';

import { dashboardAbi } from 'abi/dashboard-abi';
import { ClaimFormSchema } from 'features/claim/claim-form/types';
import invariant from 'tiny-invariant';

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
  const { activeVault } = useVaultInfo();

  const formObject = useForm<ClaimFormSchema>({
    defaultValues: {
      recipient: '',
    },
    mode: 'all',
    // TODO: validation
    reValidateMode: 'onChange',
  });
  const { claim, retryEvent } = useClaim();

  const onSubmit = useCallback(
    async ({ recipient }: ClaimFormSchema) => {
      // TODO: add validation, remove stub
      if (!isAddress(recipient)) return false;

      return claim(recipient);
    },
    [claim],
  );

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

  return (
    <ClaimDataContext.Provider value={claimInfo}>
      <FormProvider {...formObject}>
        <FormController onSubmit={onSubmit} retryEvent={retryEvent}>
          {children}
        </FormController>
      </FormProvider>
    </ClaimDataContext.Provider>
  );
};
