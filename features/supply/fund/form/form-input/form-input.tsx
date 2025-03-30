import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import {
  TokenSelectHookForm,
  TokenOption,
} from 'shared/hook-form/controls/token-select-hook-form/token-select-hook-form';
import { TOKENS_TO_MINT } from 'features/supply/const';
import { useController } from 'react-hook-form';

const OPTIONS: TokenOption[] = [
  { token: TOKENS_TO_MINT.ETH },
  { token: TOKENS_TO_MINT.wstETH },
];

export const FormInput = () => {
  const { field } = useController({ name: 'amount' });
  const {
    field: { value: tokenValue },
  } = useController({ name: 'token' });

  return (
    <InputGroup>
      <TokenSelectHookForm options={OPTIONS} />
      <InputAmount label={`${tokenValue} amount`} {...field} />
    </InputGroup>
  );
};
