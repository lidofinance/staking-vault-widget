import { InputGroup } from '@lidofinance/lido-ui';
import { InputAmount } from 'shared/components';

import { useController } from 'react-hook-form';
import { useWithdrawFormData } from 'features/supply/withdraw/withdraw-form-context';

export const AmountField = () => {
  const { withdrawableAmount } = useWithdrawFormData();
  const { field } = useController({ name: 'amount' });

  return (
    <>
      <InputGroup>
        <InputAmount
          maxValue={withdrawableAmount}
          label={`ETH amount`}
          {...field}
        />
      </InputGroup>
    </>
  );
};
