import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

import { useClaimData } from './hooks';

export const Claimable = () => {
  const { claimableFeeQuery } = useClaimData();

  return (
    <InfoRowAmount
      title={vaultTexts.actions.claim.available}
      amount={claimableFeeQuery.data}
      token="ETH"
      loading={claimableFeeQuery.isPending}
      noDataLabel="-"
    />
  );
};
