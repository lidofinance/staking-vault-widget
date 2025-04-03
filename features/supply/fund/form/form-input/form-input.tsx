import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import {
  TokenSelectHookForm,
  TokenOption,
} from 'shared/hook-form/controls/token-select-hook-form/token-select-hook-form';
import { TOKENS_TO_MINT } from 'features/supply/const';
import { useController, useFormContext } from 'react-hook-form';
import { useDappStatus, useWstethBalance } from '../../../../../modules/web3';
import { useBalance } from 'wagmi';

const OPTIONS: TokenOption[] = [
  { token: TOKENS_TO_MINT.ETH },
  { token: TOKENS_TO_MINT.wstETH },
];

export const FormInput = () => {
  const { field } = useController({ name: 'amount' });
  const { watch } = useFormContext();
  const { address } = useDappStatus();
  const { data: ethBalance } = useBalance({ address });
  const { data: wstethBalance } = useWstethBalance({ account: address });
  const token = watch('token');
  const balance = token === 'ETH' ? ethBalance?.value : wstethBalance;

  return (
    <InputGroup>
      <TokenSelectHookForm options={OPTIONS} />
      <InputAmount maxValue={balance} label={`${token} amount`} {...field} />
    </InputGroup>
  );
};
