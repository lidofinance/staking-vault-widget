import { useClaimFormData } from 'features/claim/claim-form/claim-form-context';
import { InfoRowAmount } from 'shared/components/form';
import { vaultTexts } from 'modules/vaults';

export const Balance = () => {
  const { isLoadingClaimInfo, availableToClaim } = useClaimFormData();

  return (
    <InfoRowAmount
      title={vaultTexts.actions.claim.available}
      amount={availableToClaim}
      token="ETH"
      loading={isLoadingClaimInfo}
    />
  );
};
