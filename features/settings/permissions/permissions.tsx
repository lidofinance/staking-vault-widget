import { useFormState } from 'react-hook-form';

import {
  RoleDescription,
  PermissionsAction,
  AddressBlock,
} from 'features/settings/permissions/components';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from './styles';
import { SectionContainer } from 'features/settings/permissions/styles';

import { PermissionsDataProvider, PermissionsFormProvider } from './contexts';
import {
  VAULT_MANAGER_PERMISSIONS_LIST,
  NO_MANAGER_PERMISSION_LIST,
  VAULT_ROOT_ROLES,
  useVaultPermission,
  vaultTexts,
  VAULTS_NO_ROLES,
  VAULT_OWNER_ROLES,
} from 'modules/vaults';

type PermissionSectionEntry = {
  permissionsTitle: string;
  roles: (VAULTS_NO_ROLES | VAULT_OWNER_ROLES)[];
  canEditRole: VAULT_ROOT_ROLES;
};

const renderPermissionsList: PermissionSectionEntry[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    canEditRole: 'defaultAdmin',
    roles: VAULT_MANAGER_PERMISSIONS_LIST,
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    canEditRole: 'nodeOperatorManager',
    roles: NO_MANAGER_PERMISSION_LIST,
  },
];

const PermissionsSection = (props: PermissionSectionEntry) => {
  const { disabled } = useFormState();
  const { hasPermission } = useVaultPermission(props.canEditRole);

  const isReadonly = disabled || !hasPermission;

  return (
    <PermissionContainer>
      <PermissionGroupTitle>{props.permissionsTitle}</PermissionGroupTitle>
      <PermissionBlock>
        {props.roles.map((role) => {
          const { title, hint } = vaultTexts.roles[role];
          return (
            <PermissionRoleWrapper key={role}>
              <RoleDescription
                permission={role}
                description={title}
                tooltip={hint}
              />
              <AddressBlock readonly={isReadonly} permission={role} />
            </PermissionRoleWrapper>
          );
        })}
      </PermissionBlock>
    </PermissionContainer>
  );
};

export const PermissionsSettings = () => {
  return (
    <PermissionsDataProvider>
      <PermissionsFormProvider>
        <SectionContainer>
          {renderPermissionsList.map((section) => (
            <PermissionsSection key={section.permissionsTitle} {...section} />
          ))}
          <PermissionsAction />
        </SectionContainer>
      </PermissionsFormProvider>
    </PermissionsDataProvider>
  );
};
