import {
  AddressList,
  RoleDescription,
  PermissionsAction,
} from 'features/settings/permissions/components';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from './styles';
import { SectionContainer } from 'features/settings/permissions/styles';

import { PermissionsRoles } from 'features/settings/permissions/types';
import { PermissionsDataProvider, PermissionsFormProvider } from './contexts';
import {
  VAULT_MANAGER_PERMISSIONS_LIST,
  NO_MANAGER_PERMISSION_LIST,
  VAULT_ROOT_ROLES,
} from 'modules/vaults';
import { useVaultPermission } from 'modules/vaults/hooks/use-vault-permissions';

type PermissionSectionEntry = {
  permissionsTitle: string;
  payload: PermissionsRoles[];
  canEditRole: VAULT_ROOT_ROLES;
};

const renderPermissionsList: PermissionSectionEntry[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    canEditRole: 'defaultAdmin',
    payload: VAULT_MANAGER_PERMISSIONS_LIST,
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    canEditRole: 'nodeOperatorManager',
    payload: NO_MANAGER_PERMISSION_LIST,
  },
];

const PermissionsSection = (props: PermissionSectionEntry) => {
  const { hasPermission } = useVaultPermission(props.canEditRole);

  return (
    <PermissionContainer>
      <PermissionGroupTitle>{props.permissionsTitle}</PermissionGroupTitle>
      <PermissionBlock>
        {props.payload.map(({ role, title, tooltip }) => {
          return (
            <PermissionRoleWrapper key={role}>
              <RoleDescription
                permission={role}
                description={title}
                tooltip={tooltip}
              />
              <AddressList readonly={!hasPermission} permission={role} />
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
