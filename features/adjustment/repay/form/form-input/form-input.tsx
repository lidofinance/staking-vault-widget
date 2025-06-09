import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import { TokenSelectHookForm } from 'shared/hook-form/controls';

import { useController, useFormContext } from 'react-hook-form';
import { useRepayFormData } from '../repay-form-context';
import { VAULT_MINT_TOKENS } from 'modules/vaults';

export const FormInput = () => {
  const { field: amountField } = useController({ name: 'amount' });
  const { watch } = useFormContext();
  const token = watch('token');
  const { stEthBalance, wstEthBalance } = useRepayFormData();

  const maxValue = token === 'stETH' ? stEthBalance : wstEthBalance;

  // TODO: add error message
  return (
    <InputGroup>
      <TokenSelectHookForm options={VAULT_MINT_TOKENS} />
      <InputAmount
        maxValue={maxValue}
        label={`${token} amount`}
        {...amountField}
      />
    </InputGroup>
  );
};
