import { useFormContext, useWatch } from 'react-hook-form';

import {
  AddressInputHookForm,
  CheckboxHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import {
  useEthBalanceWarning,
  VAULT_FUNDING_TOKENS,
  vaultTexts,
} from 'modules/vaults';

import { useSupplyForm } from './supply-form-provider/supply-form-provider';
import type { SupplyFormValidatedValues } from './types';

export const SupplyFormInputs = () => {
  const { balanceQuery, isStethMintableQuery } = useSupplyForm();
  const {
    formState: { disabled },
  } = useFormContext<SupplyFormValidatedValues>();

  const [mintSteth, amount, token] = useWatch<
    SupplyFormValidatedValues,
    ['mintSteth', 'amount', 'token']
  >({
    name: ['mintSteth', 'amount', 'token'],
  });

  const ethBalanceWarning = useEthBalanceWarning(
    token === 'ETH' ? amount : undefined,
  );

  const isStethMintable = isStethMintableQuery.data === true;
  const maxValue = balanceQuery.data;

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_FUNDING_TOKENS}
        maxAmount={maxValue}
        disabled={disabled}
        warning={ethBalanceWarning}
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
