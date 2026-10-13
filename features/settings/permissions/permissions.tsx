import {
  VAULT_MANAGER_PERMISSIONS_LIST,
  NO_MANAGER_PERMISSION_LIST,
  vaultTexts,
} from 'modules/vaults';

import {
  SectionContainer,
  ContentWrapper,
} from 'features/settings/shared/components';
import {
  CustodyBadge,
  PermissionsAction,
} from 'features/settings/permissions/components';
import {
  VaultPermissions,
  PDGPermissions,
} from 'features/settings/permissions/content';
import {
  CustodyLegend,
  PermissionGroupDescription,
} from 'features/settings/permissions/content/styles';
import { PermissionsFormProvider } from './permissions-form-provider';

const { vaultOwnerTitle, vaultOwnerDescription, custodyLegend } =
  vaultTexts.actions.settings.permissions;

const VaultOwnerPermissionsDescription = () => (
  <PermissionGroupDescription data-testid="vaultOwnerPermissions-description">
    <span>{vaultOwnerDescription}</span>
    <CustodyLegend>
      <CustodyBadge />
      <span>{custodyLegend}</span>
    </CustodyLegend>
  </PermissionGroupDescription>
);

const PERMISSIONS_SECTIONS = [
  {
    permissionsTitle: vaultOwnerTitle,
    description: <VaultOwnerPermissionsDescription />,
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
