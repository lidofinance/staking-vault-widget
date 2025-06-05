import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import {
  TokenSelectHookForm,
  TokenOption,
} from 'shared/hook-form/controls/token-select-hook-form/token-select-hook-form';
import { TOKENS_TO_MINT } from 'features/adjustment/const';
import { useController, useFormContext } from 'react-hook-form';
import { useRepayFormData } from '../../repay-form-context';

const OPTIONS: TokenOption[] = [
  { token: TOKENS_TO_MINT.stETH },
  { token: TOKENS_TO_MINT.wstETH },
];

export const FormInput = () => {
  const { field: amountField } = useController({ name: 'amount' });
  const { watch } = useFormContext();
  const token = watch('token');
  const { stEthBalance, wstEthBalance } = useRepayFormData();

  const maxValue = token === 'stETH' ? stEthBalance : wstEthBalance;

  // TODO: add error message
  return (
    <InputGroup>
      <TokenSelectHookForm options={OPTIONS} />
      <InputAmount
        maxValue={maxValue}
        label={`${token} amount`}
        {...amountField}
      />
    </InputGroup>
  );
};
