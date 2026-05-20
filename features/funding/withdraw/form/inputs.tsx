import { useFormState } from 'react-hook-form';

import {
  AddressInputHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { VAULT_FUNDING_TOKENS } from 'modules/vaults';

import { useWithdrawFormData } from './withdraw-form-context';

export const WithdrawFormInputs = () => {
  const { withdrawableEtherQuery } = useWithdrawFormData();
  const { disabled } = useFormState();

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_FUNDING_TOKENS}
        maxAmount={withdrawableEtherQuery.data}
        disabled={disabled}
      />
      <AddressInputHookForm
        label={'Withdraw to address'}
        fieldName="recipient"
        disabled={disabled}
      />
    </>
  );
};
