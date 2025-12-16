import { useFormContext } from 'react-hook-form';

import {
  AddressInputHookForm,
  CheckboxHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { VAULT_FUNDING_TOKENS, vaultTexts } from 'modules/vaults';

import { useSupplyForm } from './supply-form-provider/supply-form-provider';
import type { SupplyFormValidatedValues } from './types';

export const SupplyFormInputs = () => {
  const { balanceQuery, isStethMintableQuery } = useSupplyForm();
  const { watch } = useFormContext<SupplyFormValidatedValues>();
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
        data-testid="mintStethCheckbox"
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
