import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  type TokenOption,
  TokenAmountInputHookForm,
  AddressInputHookForm,
  TokenSelectHookForm,
  InputGroupHookForm,
} from 'shared/hook-form/controls';

import { useFundForm } from '../fund-form-provider/fund-form-provider';
import type { FundFormSchemaType } from '../types';

import { CheckMint } from './styles';
import { vaultTexts } from 'modules/vaults';

const options: TokenOption[] = [
  {
    token: 'ETH',
    label: 'ETH',
  },
  {
    token: 'wETH',
    label: 'wETH',
  },
];

export const Inputs = () => {
  const [inputInFocus, setInputInFocus] = useState(false);
  const { balanceQuery, isStethMintableQuery } = useFundForm();
  const { register, watch } = useFormContext<FundFormSchemaType>();
  const mintSteth = watch('mintSteth');
  const token = watch('token');

  const isStethMintable = isStethMintableQuery.data === true;
  const maxValue = balanceQuery.data;

  return (
    <>
      <InputGroupHookForm showErrorMessage={inputInFocus} errorField="amount">
        <TokenSelectHookForm
          errorField="amount"
          fieldName="token"
          options={options}
        />
        <TokenAmountInputHookForm
          token={token}
          showErrorMessage={false}
          fieldName="amount"
          maxValue={maxValue}
          onFocus={() => setInputInFocus(true)}
          onBlur={() => setInputInFocus(false)}
        />
      </InputGroupHookForm>
      <CheckMint
        {...register('mintSteth', { disabled: !isStethMintable })}
        label={vaultTexts.actions.supply.mint.isMint}
      />
      <AddressInputHookForm
        hidden={!mintSteth}
        label={vaultTexts.actions.supply.mint.mintTo}
        fieldName="mintAddress"
      />
    </>
  );
};
