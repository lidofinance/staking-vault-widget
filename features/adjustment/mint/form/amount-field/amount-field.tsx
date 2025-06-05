import { InputGroup } from '@lidofinance/lido-ui';
import { useController, useFormContext } from 'react-hook-form';
import { InputAmount } from 'shared/components';

import {
  TokenSelectHookForm,
  TokenOption,
} from 'shared/hook-form/controls/token-select-hook-form/token-select-hook-form';
import { TOKENS_TO_MINT } from 'features/adjustment/const';
import { useMintFormData } from 'features/adjustment/mint/mint-form-context';

const OPTIONS: TokenOption[] = [
  { token: TOKENS_TO_MINT.stETH },
  { token: TOKENS_TO_MINT.wstETH },
];

export const AmountField = () => {
  const { mintableStETH, mintableWstETH } = useMintFormData();
  const { field } = useController({ name: 'amount' });
  const { watch } = useFormContext();
  const token = watch('token');
  const maxValue = token === 'stETH' ? mintableStETH : mintableWstETH;

  // TODO: add errors
  return (
    <>
      <InputGroup>
        <TokenSelectHookForm options={OPTIONS} />
        <InputAmount {...field} label={`${token} amount`} maxValue={maxValue} />
      </InputGroup>
    </>
  );
};
