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
import type { UseQueryResult } from '@tanstack/react-query';

import { useDappStatus } from 'modules/web3';
import { type MaxMintableResult } from 'modules/vaults';
import { useDisableForm } from 'shared/hook-form';
import { FormControllerStyled } from 'shared/components/form';

import { mintFormResolver } from './validation';
import { useMintData } from './use-mint-data';
import { useMint } from './use-mint';

import type {
  MintFormFieldValues,
  MintFormValidatedValues,
  MintFormValidationContextAwaitable,
} from '../types';

type MintFormDataContextValue = {
  mintableQuery: UseQueryResult<MaxMintableResult>;
};

const MintFormDataContext = createContext<MintFormDataContextValue | null>(
  null,
);
MintFormDataContext.displayName = 'MintFormDataContext';

export const useMintFormData = () => {
  const value = useContext(MintFormDataContext);
  invariant(
    value,
    'useMintFormData was used outside the MintDataContext provider',
  );

  return value;
};

export const MintFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { validationContext, mintableQuery, invalidateMintData } =
    useMintData();
  const disabled = useDisableForm();
  const { mint, retryEvent } = useMint();

  const formObject = useForm<
    MintFormFieldValues,
    MintFormValidationContextAwaitable,
    MintFormValidatedValues
  >({
    defaultValues: {
      amount: null,
      token: 'stETH',
      recipient: '',
    },
    disabled: !isDappActive || disabled,
    mode: 'onTouched',
    resolver: mintFormResolver,
    context: validationContext,
  });

  const onSubmit = useCallback(
    async (values: MintFormValidatedValues) => {
      const success = await mint(values);
      await invalidateMintData();
      return success;
    },
    [invalidateMintData, mint],
  );

  return (
    <MintFormDataContext.Provider
      value={useMemo(() => ({ mintableQuery }), [mintableQuery])}
    >
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
        data-testid="mintForm"
      >
        {children}
      </FormControllerStyled>
    </MintFormDataContext.Provider>
  );
};
