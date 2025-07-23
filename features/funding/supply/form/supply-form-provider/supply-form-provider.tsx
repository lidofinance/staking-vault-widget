import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import invariant from 'tiny-invariant';
import { useForm } from 'react-hook-form';

import { useDappStatus } from 'modules/web3';
import { useAwaiter } from 'shared/hooks/use-awaiter';
import { FormControllerStyled } from 'shared/components/form';

import { SupplyFormResolver } from './validation';

import {
  useSupply,
  useSupplyFormValidationContext,
  useSupplyFormData,
} from './hooks';
import {
  SupplyFormData,
  SupplyFormDataAwaitableValidationContext,
  SupplyFormFieldValues,
  SupplyFormValidatedValues,
} from '../types';

// Context for sharing relevant form data
const SupplyFormDataContext = createContext<SupplyFormData | null>(null);
SupplyFormDataContext.displayName = 'SupplyFormDataContext';

export const useSupplyForm = () => {
  const context = useContext(SupplyFormDataContext);
  invariant(
    context,
    '[useSupplyForm] useSupplyForm must be used within a SupplyFormProvider',
  );
  return context;
};

export const SupplyFormProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { isDappActive } = useDappStatus();
  const { validationContext } = useSupplyFormValidationContext();
  const { supply, retryEvent } = useSupply();

  const formObject = useForm<
    SupplyFormFieldValues,
    SupplyFormDataAwaitableValidationContext,
    SupplyFormValidatedValues
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
    resolver: SupplyFormResolver,
  });

  const { watch, resetField } = formObject;
  const [mintSteth, amount, token] = watch(['mintSteth', 'amount', 'token']);

  const supplyFormData = useSupplyFormData(token, mintSteth, amount);
  const invalidateSupplyFormData = supplyFormData.invalidateSupplyFormData;
  const isStethMintable = supplyFormData.isStethMintableQuery.data === true;

  useEffect(() => {
    // reset mintSteth  when stETH is not mintable
    if (mintSteth && !isStethMintable) {
      resetField('mintSteth');
    }
    // reset mintAddress when mintSteth=false
    if (!mintSteth) {
      resetField('mintAddress');
    }
  }, [isStethMintable, mintSteth, resetField]);

  const onSubmit = useCallback(
    async (values: SupplyFormValidatedValues) => {
      const result = await supply(values);
      // revalidate form data because some TXs may have changed the state
      await invalidateSupplyFormData();

      return result;
    },
    [invalidateSupplyFormData, supply],
  );

  return (
    <SupplyFormDataContext.Provider value={supplyFormData}>
      <FormControllerStyled
        formObject={formObject}
        onSubmit={onSubmit}
        retryEvent={retryEvent}
      >
        {children}
      </FormControllerStyled>
    </SupplyFormDataContext.Provider>
  );
};
