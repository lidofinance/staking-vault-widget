import { useWithdrawFormData } from 'features/supply/withdraw/form/withdraw-form-context';

import { InfoRowAmount } from 'shared/components/form';

export const Withdrawable = () => {
  const { withdrawableEtherQuery } = useWithdrawFormData();
  const { data, isLoading } = withdrawableEtherQuery;

  return (
    <InfoRowAmount
      amount={data}
      isLoading={isLoading}
      tokenSymbol="ETH"
      label="Available to withdraw"
    />
  );
};
