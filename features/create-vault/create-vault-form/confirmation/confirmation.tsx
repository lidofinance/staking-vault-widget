import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { ConfirmationAction } from 'features/create-vault/create-vault-form/confirmation/confirmation-action';
import { ConfirmationVaultInfo } from 'features/create-vault/create-vault-form/confirmation/confirmation-vault-info';
import { SectionContainer } from 'features/create-vault/styles';

import { ConfirmationList } from 'features/create-vault/types';
import { CREATE_VAULT_FORM_STEPS } from '../../consts';

const confirmationList: { title: string; list: ConfirmationList }[] = [
  {
    title: 'Main settings',
    list: 'mainSettings',
  },
  {
    title: 'Vault Manager Permissions',
    list: 'vaultManagerPermissions',
  },
  {
    title: 'Vault Manager Permissions',
    list: 'nodeOperatorManagerPermissions',
  },
];

export const Confirmation = () => {
  const { step } = useCreateVaultFormData();

  if (step !== CREATE_VAULT_FORM_STEPS.confirm) {
    return null;
  }

  return (
    <SectionContainer step={step} currentStep={CREATE_VAULT_FORM_STEPS.confirm}>
      {confirmationList.map(({ title, list }) => (
        <ConfirmationVaultInfo key={list} title={title} list={list} />
      ))}
      <ConfirmationAction />
    </SectionContainer>
  );
};
