import { useClaimForm } from 'features/claim/claim-form/form/claim-form-context';
import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

export const Claimable = () => {
  const { claimableFeeQuery } = useClaimForm();

  return (
    <InfoRowAmount
      title={vaultTexts.actions.claim.available}
      amount={claimableFeeQuery.data}
      token="ETH"
      loading={claimableFeeQuery.isLoading}
      noDataLabel="-"
    />
  );
};
