import {
  ConfirmationVaultInfo,
  ConfirmationVaultInfoProps,
} from './confirmation-vault-info/confirmation-vault-info';
import {
  NO_MANAGER_PERMISSION_LIST,
  VAULT_MANAGER_PERMISSIONS_LIST,
} from 'modules/vaults';
import { MAIN_SETTINGS } from 'features/create-vault/consts';
import { ConfirmationAction } from './confirmation-action';
import { SectionContainer } from '../../styles';

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

type ConfirmationProps = {
  isShown: boolean;
};

export const Confirmation = ({ isShown }: ConfirmationProps) => {
  return (
    <SectionContainer isShown={isShown}>
      {confirmationList.map(({ title, list }) => (
        <ConfirmationVaultInfo key={title} title={title} list={list} />
      ))}
      <ConfirmationAction />
    </SectionContainer>
  );
};
