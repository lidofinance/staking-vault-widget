import {
  FC,
  ReactNode,
  useMemo,
  useCallback,
  createContext,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { FormControllerStyled } from 'shared/components/form';

import { useClaim } from './use-claim';
import { useClaimData } from './use-claim-data';
import { claimFormResolver } from './validation';

import type {
  ClaimFormFieldValues,
  ClaimFormValidatedValues,
  ClaimFormValidationContextAwaitable,
} from '../types';

type ClaimFormContextValue = {
  claimableFeeQuery: ReturnType<typeof useClaimData>['claimableFeeQuery'];
};

const ClaimFormContext = createContext<ClaimFormContextValue | null>(null);
ClaimFormContext.displayName = 'ClaimFormContext';

export const useClaimForm = () => {
  const value = useContext(ClaimFormContext);
  invariant(
    value,
    'useClaimFormData was used outside the ClaimDataContext provider',
  );

  return value;
};

export const ClaimFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { claim, retryEvent } = useClaim();
  const { claimableFeeQuery, invalidateClaimData, validationContext } =
    useClaimData();
  const { isDappActive } = useDappStatus();

  const formObject = useForm<
    ClaimFormFieldValues,
    ClaimFormValidationContextAwaitable,
    ClaimFormValidatedValues
  >({
    defaultValues: {
      recipient: '',
    },
    disabled: !isDappActive,
    mode: 'onTouched',
    context: validationContext,
    resolver: claimFormResolver,
  });

  const onSubmit = useCallback(
    async (values: ClaimFormValidatedValues) => {
      const success = await claim(values);
      await invalidateClaimData();
      return success;
    },
    [claim, invalidateClaimData],
  );

  const claimInfo = useMemo(
    () => ({
      claimableFeeQuery,
    }),
    [claimableFeeQuery],
  );

  return (
    <ClaimFormContext.Provider value={claimInfo}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
      >
        {children}
      </FormControllerStyled>
    </ClaimFormContext.Provider>
  );
};
