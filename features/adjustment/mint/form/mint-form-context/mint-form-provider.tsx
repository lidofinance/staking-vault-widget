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

import { useDappStatus } from 'modules/web3';

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
  mintableQuery: ReturnType<typeof useMintData>['mintableQuery'];
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
    disabled: !isDappActive,
    mode: 'onTouched',
    shouldFocusError: true,
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
      >
        {children}
      </FormControllerStyled>
    </MintFormDataContext.Provider>
  );
};
