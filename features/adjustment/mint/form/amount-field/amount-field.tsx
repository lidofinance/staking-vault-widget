import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import {
  TokenSelectHookForm,
  TokenOption,
} from 'shared/hook-form/controls/token-select-hook-form/token-select-hook-form';
import { TOKENS_TO_MINT } from 'features/supply/const';

const OPTIONS: TokenOption[] = [
  { token: TOKENS_TO_MINT.stETH },
  { token: TOKENS_TO_MINT.wstETH },
];

export const AmountField = () => {
  return (
    <>
      <InputGroup>
        <TokenSelectHookForm options={OPTIONS} />
        <InputAmount label="stETH amount" />
      </InputGroup>
    </>
  );
};
