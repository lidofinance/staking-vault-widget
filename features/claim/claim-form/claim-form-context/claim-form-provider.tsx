import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';
import { isAddress, ReadContractErrorType } from 'viem';
import { useReadContract } from 'wagmi';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useVaultInfo } from 'modules/vaults';
import { dashboardAbi } from 'abi/dashboard-abi';
import { FormControllerStyled } from 'shared/components/form';

import { useClaim } from 'features/claim/claim-form/hooks';
import { ClaimFormSchema } from 'features/claim/claim-form/types';

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
  const { isDappActive } = useDappStatus();
  const formObject = useForm<ClaimFormSchema>({
    defaultValues: {
      recipient: '',
    },
    disabled: !isDappActive,
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
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
      >
        {children}
      </FormControllerStyled>
    </ClaimDataContext.Provider>
  );
};
