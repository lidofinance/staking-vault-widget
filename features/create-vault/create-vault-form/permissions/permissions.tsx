import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { RoleDescription } from 'features/create-vault/create-vault-form/permissions/role-description';
import { AddressList } from 'features/create-vault/create-vault-form/permissions/address-list';
import { PermissionsAction } from 'features/create-vault/create-vault-form/permissions/permissions-action';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from './styles';
import { SectionContainer } from 'features/create-vault/styles';
import { PermissionsRoles } from 'features/create-vault/types';
import {
  CREATE_VAULT_FORM_STEPS,
  NO_MANAGER_PERMISSION_LIST,
  VAULT_MANAGER_PERMISSIONS_LIST,
} from '../../consts';

type RenderPermissions = {
  permissionsTitle: string;
  payload: PermissionsRoles[];
};

const renderPermissionsList: RenderPermissions[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    payload: VAULT_MANAGER_PERMISSIONS_LIST,
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    payload: NO_MANAGER_PERMISSION_LIST,
  },
];

export const Permissions = () => {
  const { step } = useCreateVaultFormData();

  return (
    <SectionContainer
      step={step}
      currentStep={CREATE_VAULT_FORM_STEPS.permissions}
    >
      {renderPermissionsList.map(({ permissionsTitle, payload }) => (
        <PermissionContainer key={permissionsTitle}>
          <PermissionGroupTitle>{permissionsTitle}</PermissionGroupTitle>
          <PermissionBlock>
            {payload.map(({ role, title, tooltip }) => {
              return (
                <PermissionRoleWrapper key={role}>
                  <RoleDescription
                    permission={role}
                    description={title}
                    tooltip={tooltip}
                  />
                  <AddressList permission={role} />
                </PermissionRoleWrapper>
              );
            })}
          </PermissionBlock>
        </PermissionContainer>
      ))}
      <PermissionsAction />
    </SectionContainer>
  );
};
