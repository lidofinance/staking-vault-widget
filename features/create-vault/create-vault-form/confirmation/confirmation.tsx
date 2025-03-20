import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { ConfirmationAction } from 'features/create-vault/create-vault-form/confirmation/confirmation-action';
import { ConfirmationVaultInfo } from 'features/create-vault/create-vault-form/confirmation/confirmation-vault-info';
import { SectionContainer } from 'features/create-vault/styles';

import { ConfirmationList } from 'features/create-vault/types';

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

  if (step !== 3) {
    return null;
  }

  return (
    <SectionContainer step={step} currentStep={3}>
      {confirmationList.map(({ title, list }) => (
        <ConfirmationVaultInfo key={list} title={title} list={list} />
      ))}
      <ConfirmationAction />
    </SectionContainer>
  );
};
