import { useFormContext } from 'react-hook-form';

import { MintFormFieldValues } from './types';
import { InfoRowAmount } from 'shared/components/form/info-row-amount';

export const TxInfo = () => {
  const { watch } = useFormContext<MintFormFieldValues>();
  const [token, amount] = watch(['token', 'amount']);

  return (
    <InfoRowAmount
      label="You will receive"
      amount={amount}
      tokenSymbol={token}
      noDataLabel="-"
    />
  );
};
