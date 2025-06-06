import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  TokenAmountInputHookForm,
  AddressInputHookForm,
  TokenSelectHookForm,
  InputGroupHookForm,
} from 'shared/hook-form/controls';
import { VAULT_SUPPLY_TOKENS, vaultTexts } from 'modules/vaults';

import { useFundForm } from '../fund-form-provider/fund-form-provider';
import type { FundFormValidatedValues } from '../types';

import { CheckMint } from './styles';

export const Inputs = () => {
  const [inputInFocus, setInputInFocus] = useState(false);
  const { balanceQuery, isStethMintableQuery } = useFundForm();
  const { register, watch } = useFormContext<FundFormValidatedValues>();
  const [mintSteth, token] = watch(['mintSteth', 'token']);

  const isStethMintable = isStethMintableQuery.data === true;
  const maxValue = balanceQuery.data;

  return (
    <>
      <InputGroupHookForm showErrorMessage={inputInFocus} errorField="amount">
        <TokenSelectHookForm
          errorField="amount"
          fieldName="token"
          options={VAULT_SUPPLY_TOKENS}
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
