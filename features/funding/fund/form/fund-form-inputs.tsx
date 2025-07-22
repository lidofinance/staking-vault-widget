import { useFormContext } from 'react-hook-form';

import {
  AddressInputHookForm,
  CheckboxHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { VAULT_FUNDING_TOKENS, vaultTexts } from 'modules/vaults';

import { useFundForm } from './fund-form-provider/fund-form-provider';
import type { FundFormValidatedValues } from './types';

export const FundFormInputs = () => {
  const { balanceQuery, isStethMintableQuery } = useFundForm();
  const { watch } = useFormContext<FundFormValidatedValues>();
  const mintSteth = watch('mintSteth');

  const isStethMintable = isStethMintableQuery.data === true;
  const maxValue = balanceQuery.data;

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_FUNDING_TOKENS}
        maxAmount={maxValue}
      />
      <CheckboxHookForm
        fieldName="mintSteth"
        label={vaultTexts.actions.supply.mint.isMint}
        disabled={!isStethMintable}
      />
      <AddressInputHookForm
        hidden={!mintSteth}
        label={vaultTexts.actions.supply.mint.mintTo}
        fieldName="mintAddress"
      />
    </>
  );
};
