import {
  VAULT_MANAGER_PERMISSIONS_LIST,
  NO_MANAGER_PERMISSION_LIST,
} from 'modules/vaults';

import {
  SectionContainer,
  ContentWrapper,
} from 'features/settings/shared/components';
import { PermissionsAction } from 'features/settings/permissions/components';
import {
  VaultPermissions,
  PDGPermissions,
} from 'features/settings/permissions/content';
import { PermissionsFormProvider } from './permissions-form-provider';

const PERMISSIONS_SECTIONS = [
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

export const PermissionsSettings = () => {
  return (
    <PermissionsFormProvider>
      <ContentWrapper>
        <SectionContainer>
          {PERMISSIONS_SECTIONS.map((section) => (
            <VaultPermissions key={section.permissionsTitle} {...section} />
          ))}
          <PDGPermissions />
          <PermissionsAction />
        </SectionContainer>
      </ContentWrapper>
    </PermissionsFormProvider>
  );
};
