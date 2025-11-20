import { useFormState } from 'react-hook-form';

import {
  useVaultPermission,
  VAULT_OWNER_ROLES,
  VAULT_ROOT_ROLES,
  VAULTS_NO_ROLES,
  vaultTexts,
} from 'modules/vaults';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from '../styles';

import {
  AddressBlock,
  RoleDescription,
} from 'features/settings/permissions/components';
import { PermissionFormField } from 'features/settings/permissions/types';

type PermissionSectionEntry = {
  permissionsTitle: string;
  roles: (VAULTS_NO_ROLES | VAULT_OWNER_ROLES)[];
  canEditRole: VAULT_ROOT_ROLES;
  dataTestId?: string;
};

export const VaultPermissions = ({
  canEditRole,
  permissionsTitle,
  roles,
  dataTestId,
}: PermissionSectionEntry) => {
  const { disabled } = useFormState();
  const { hasPermission } = useVaultPermission(canEditRole);

  const isReadonly = disabled || !hasPermission;

  return (
    <PermissionContainer
      data-testid={dataTestId ? `${dataTestId}-container` : undefined}
    >
      <PermissionGroupTitle
        data-testid={dataTestId ? `${dataTestId}-title` : undefined}
      >
        {permissionsTitle}
      </PermissionGroupTitle>
      <PermissionBlock
        data-testid={dataTestId ? `${dataTestId}-block` : undefined}
      >
        {roles.map((role) => {
          const { title, hint } = vaultTexts.roles[role];
          const permissionFormField =
            `rolesSchema.${role}` as PermissionFormField;

          return (
            <PermissionRoleWrapper
              key={role}
              data-testid={
                dataTestId ? `${dataTestId}-${role}-roleWrapper` : null
              }
            >
              <RoleDescription
                description={title}
                tooltip={hint}
                dataTestId={`${dataTestId}-${role}`}
              />
              <AddressBlock
                readonly={isReadonly}
                permissionFormField={permissionFormField}
                dataTestId={`${dataTestId}-${role}`}
              />
            </PermissionRoleWrapper>
          );
        })}
      </PermissionBlock>
    </PermissionContainer>
  );
};
