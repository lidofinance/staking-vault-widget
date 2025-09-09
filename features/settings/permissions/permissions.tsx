import { useFormState } from 'react-hook-form';

import {
  VAULT_MANAGER_PERMISSIONS_LIST,
  NO_MANAGER_PERMISSION_LIST,
  VAULT_ROOT_ROLES,
  useVaultPermission,
  vaultTexts,
  VAULTS_NO_ROLES,
  VAULT_OWNER_ROLES,
} from 'modules/vaults';

import {
  SectionContainer,
  ContentWrapper,
} from 'features/settings/shared/components';

import { PermissionsFormProvider } from './permissions-form-provider';
import { RoleDescription, PermissionsAction, AddressBlock } from './components';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from './styles';

type PermissionSectionEntry = {
  permissionsTitle: string;
  roles: (VAULTS_NO_ROLES | VAULT_OWNER_ROLES)[];
  canEditRole: VAULT_ROOT_ROLES;
  dataTestId?: string;
};

const PERMISSIONS_SECTIONS: PermissionSectionEntry[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    canEditRole: 'defaultAdmin',
    roles: VAULT_MANAGER_PERMISSIONS_LIST,
    dataTestId: 'vaultOwnerPermissions',
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    canEditRole: 'nodeOperatorManager',
    roles: NO_MANAGER_PERMISSION_LIST,
    dataTestId: 'nodeOperatorManagerPermissions',
  },
] as const;

const PermissionsSection = ({
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
      data-testid={dataTestId ? `${dataTestId}-container` : null}
    >
      <PermissionGroupTitle
        data-testid={dataTestId ? `${dataTestId}-title` : null}
      >
        {permissionsTitle}
      </PermissionGroupTitle>
      <PermissionBlock data-testid={dataTestId ? `${dataTestId}-block` : null}>
        {roles.map((role) => {
          const { title, hint } = vaultTexts.roles[role];
          return (
            <PermissionRoleWrapper
              key={role}
              data-testid={
                dataTestId ? `${dataTestId}-${role}-roleWrapper` : null
              }
            >
              <RoleDescription
                permission={role}
                description={title}
                tooltip={hint}
                dataTestId={`${dataTestId}-${role}`}
              />
              <AddressBlock
                readonly={isReadonly}
                permission={role}
                dataTestId={`${dataTestId}-${role}`}
              />
            </PermissionRoleWrapper>
          );
        })}
      </PermissionBlock>
    </PermissionContainer>
  );
};

export const PermissionsSettings = () => {
  return (
    <PermissionsFormProvider>
      <ContentWrapper>
        <SectionContainer>
          {PERMISSIONS_SECTIONS.map((section) => (
            <PermissionsSection
              key={section.permissionsTitle}
              {...section}
              dataTestId={section.dataTestId}
            />
          ))}
          <PermissionsAction />
        </SectionContainer>
      </ContentWrapper>
    </PermissionsFormProvider>
  );
};
