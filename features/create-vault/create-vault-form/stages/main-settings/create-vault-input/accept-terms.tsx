import { vaultTexts } from 'modules/vaults';

import { CreateVaultInput } from './create-vault-input';

const texts = vaultTexts.actions.createVault.fields.acceptTerms;

export const AcceptTerms = () => {
  return (
    <CreateVaultInput
      name="acceptTerms"
      dataType="confirm"
      dataTestId="createVault-acceptTerms"
      {...texts}
    />
  );
};
