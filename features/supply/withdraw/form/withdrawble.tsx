import { vaultTexts } from 'modules/vaults';
import { InfoRowAmount } from 'shared/components/form';

import { useWithdrawFormData } from './withdraw-form-context';

export const Withdrawable = () => {
  const { withdrawableEtherQuery } = useWithdrawFormData();
  const { data, isLoading } = withdrawableEtherQuery;

  return (
    <InfoRowAmount
      amount={data}
      loading={isLoading}
      token="ETH"
      title={vaultTexts.actions.withdraw.available}
    />
  );
};
