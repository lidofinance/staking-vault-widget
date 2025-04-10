import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import {
  TokenSelectHookForm,
  TokenOption,
} from 'shared/hook-form/controls/token-select-hook-form/token-select-hook-form';
import { TOKENS_TO_MINT } from 'features/supply/const';
import { useController, useFormContext } from 'react-hook-form';
import { useWithdrawFormData } from 'features/supply/withdraw/withdraw-form-context';

const OPTIONS: TokenOption[] = [
  { token: TOKENS_TO_MINT.ETH },
  { token: TOKENS_TO_MINT.wETH },
];

export const AmountField = () => {
  const { withdrawableAmount } = useWithdrawFormData();
  const { field } = useController({ name: 'amount' });
  const { watch } = useFormContext();
  const token = watch('token');

  return (
    <>
      <InputGroup>
        <TokenSelectHookForm options={OPTIONS} />
        <InputAmount
          maxValue={withdrawableAmount}
          label={`${token} amount`}
          {...field}
        />
      </InputGroup>
    </>
  );
};
