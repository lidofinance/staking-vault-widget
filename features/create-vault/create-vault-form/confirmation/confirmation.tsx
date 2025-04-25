import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { ConfirmationAction } from 'features/create-vault/create-vault-form/confirmation/confirmation-action';
import { ConfirmationVaultInfo } from 'features/create-vault/create-vault-form/confirmation/confirmation-vault-info';
import { SectionContainer } from 'features/create-vault/styles';

import { ConfirmationVaultInfoProps } from './confirmation-vault-info/confirmation-vault-info';
import {
  NO_MANAGER_PERMISSION_LIST,
  VAULT_MANAGER_PERMISSIONS_LIST,
} from 'modules/vaults';
import {
  CREATE_VAULT_FORM_STEPS,
  MAIN_SETTINGS,
} from 'features/create-vault/consts';

const confirmationList: ConfirmationVaultInfoProps[] = [
  {
    title: 'Main settings',
    list: MAIN_SETTINGS,
  },
  {
    title: 'Vault Manager Permissions',
    list: VAULT_MANAGER_PERMISSIONS_LIST.map((p) => ({
      title: p.title,
      name: `roles.${p.role}`,
      dataType: 'address',
    })),
  },
  {
    title: 'Node Operator Manager Permissions',
    list: NO_MANAGER_PERMISSION_LIST.map((p) => ({
      title: p.title,
      name: `roles.${p.role}`,
      dataType: 'address',
    })),
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
        <ConfirmationVaultInfo key={title} title={title} list={list} />
      ))}
      <ConfirmationAction />
    </SectionContainer>
  );
};
