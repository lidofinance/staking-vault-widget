import { useFormContext } from 'react-hook-form';

import {
  AddressInputHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { VAULT_SUPPLY_TOKENS, vaultTexts } from 'modules/vaults';

import { useFundForm } from '../fund-form-provider/fund-form-provider';
import type { FundFormValidatedValues } from '../types';

import { CheckMint } from './styles';

export const Inputs = () => {
  const { balanceQuery, isStethMintableQuery } = useFundForm();
  const { register, watch } = useFormContext<FundFormValidatedValues>();
  const mintSteth = watch('mintSteth');

  const isStethMintable = isStethMintableQuery.data === true;
  const maxValue = balanceQuery.data;

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_SUPPLY_TOKENS}
        maxAmount={maxValue}
      />
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
