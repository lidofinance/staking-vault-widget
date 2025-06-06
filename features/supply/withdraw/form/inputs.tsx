import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  AddressInputHookForm,
  InputGroupHookForm,
  TokenAmountInputHookForm,
  TokenSelectHookForm,
} from 'shared/hook-form/controls';
import { WithdrawFormFieldValues } from './types';
import { useWithdrawFormData } from './withdraw-form-context';
import { VAULT_SUPPLY_TOKENS } from 'modules/vaults';

export const WithdrawFormInputs = () => {
  const [inputInFocus, setInputInFocus] = useState(false);
  const { withdrawableEtherQuery } = useWithdrawFormData();
  const { watch } = useFormContext<WithdrawFormFieldValues>();
  const token = watch('token');

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
          maxValue={withdrawableEtherQuery.data}
          onFocus={() => setInputInFocus(true)}
          onBlur={() => setInputInFocus(false)}
        />
      </InputGroupHookForm>
      <AddressInputHookForm
        label={'Withdraw to address'}
        fieldName="recipient"
      />
    </>
  );
};
