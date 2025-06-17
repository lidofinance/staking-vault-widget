import {
  AddressInputHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { useWithdrawFormData } from './withdraw-form-context';
import { VAULT_SUPPLY_TOKENS } from 'modules/vaults';

export const WithdrawFormInputs = () => {
  const { withdrawableEtherQuery } = useWithdrawFormData();

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_SUPPLY_TOKENS}
        maxAmount={withdrawableEtherQuery.data}
      />
      <AddressInputHookForm
        label={'Withdraw to address'}
        fieldName="recipient"
      />
    </>
  );
};
