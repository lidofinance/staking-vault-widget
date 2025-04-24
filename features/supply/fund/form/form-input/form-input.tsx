import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';
import { useController } from 'react-hook-form';
import { useDappStatus } from 'modules/web3';
import { useBalance } from 'wagmi';

export const FormInput = () => {
  const { field } = useController({ name: 'amount' });
  const { address } = useDappStatus();
  const { data: ethBalance } = useBalance({ address });

  return (
    <InputGroup>
      <InputAmount
        maxValue={ethBalance?.value}
        label={`ETH amount`}
        {...field}
      />
    </InputGroup>
  );
};
