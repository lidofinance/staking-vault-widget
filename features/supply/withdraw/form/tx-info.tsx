import { useFormContext } from 'react-hook-form';

import { InfoRowAmount } from 'shared/components/form';

import type { WithdrawFormFieldValues } from './types';

export const TxInfo = () => {
  const { watch } = useFormContext<WithdrawFormFieldValues>();
  const [amount, token] = watch(['amount', 'token']);

  return (
    <InfoRowAmount
      label="You will receive"
      amount={amount}
      token={token}
      noDataLabel="-"
    />
  );
};
