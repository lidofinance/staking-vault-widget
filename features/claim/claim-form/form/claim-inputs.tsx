import { vaultTexts } from 'modules/vaults';
import { AddressInputHookForm } from 'shared/hook-form/controls';

export const ClaimInputs = () => {
  return (
    <AddressInputHookForm
      label={vaultTexts.actions.claim.addressLabel}
      fieldName="recipient"
    />
  );
};
