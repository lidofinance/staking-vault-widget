import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import invariant from 'tiny-invariant';
import { FormProvider, useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { FundFormResolver } from './validation';

import {
  useFund,
  useFundFormValidationContext,
  useFundFormData,
} from './hooks';
import { FormControllerStyled } from './styles';
import {
  FundFormData,
  FundFormDataAwaitableValidationContext,
  FundFormFieldValues,
  FundFormValidatedValues,
} from '../types';

// Context for sharing relevant form data
const FundFormDataContext = createContext<FundFormData | null>(null);
FundFormDataContext.displayName = 'FundFormDataContext';

export const useFundForm = () => {
  const context = useContext(FundFormDataContext);
  invariant(
    context,
    '[useFundForm] useFundForm must be used within a FundFormProvider',
  );
  return context;
};

export const FundFormProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { isDappActive } = useDappStatus();
  const { validationContext } = useFundFormValidationContext();
  const { fund, retryEvent } = useFund();

  const formObject = useForm<
    FundFormFieldValues,
    FundFormDataAwaitableValidationContext,
    FundFormValidatedValues
  >({
    defaultValues: {
      token: 'ETH',
      amount: null,
      mintSteth: false,
      mintAddress: '',
    },
    mode: 'onTouched',
    disabled: !isDappActive,
    context: useAwaiter(validationContext).awaiter,
    resolver: FundFormResolver,
  });

  const { watch, resetField } = formObject;
  const [mintSteth, amount, token] = watch(['mintSteth', 'amount', 'token']);

  const fundFormData = useFundFormData(token, mintSteth, amount);
  const invalidateFundFormData = fundFormData.invalidateFundFormData;
  const isStethMintable = fundFormData.isStethMintableQuery.data === true;

  useEffect(() => {
    // reset mintSteth  when stETH is not mintable
    if (mintSteth && !isStethMintable) {
      resetField('mintSteth');
    }
    // reset mintAddress when mintSteth=false
    if (!mintSteth) {
      resetField('mintAddress', { defaultValue: '' });
    }
  }, [isStethMintable, mintSteth, resetField]);

  const onSubmit = useCallback(
    async (values: FundFormValidatedValues) => {
      const result = await fund(values);
      // revalidate form data because some TXs may have changed the state
      await invalidateFundFormData();

      return result;
    },
    [fund, invalidateFundFormData],
  );

  return (
    <FormProvider {...formObject}>
      <FundFormDataContext.Provider value={fundFormData}>
        <FormControllerStyled onSubmit={onSubmit} retryEvent={retryEvent}>
          {children}
        </FormControllerStyled>
      </FundFormDataContext.Provider>
    </FormProvider>
  );
};
