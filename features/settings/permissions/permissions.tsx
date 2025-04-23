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
import {
  adminPermissionsList,
  noPermissionsList,
} from 'features/settings/permissions/consts';
import { PermissionsRoles } from 'features/settings/permissions/types';
import { PermissionsDataProvider, PermissionsFormProvider } from './contexts';

interface RenderPermissions {
  permissionsTitle: string;
  payload: PermissionsRoles[];
}

const renderPermissionsList: RenderPermissions[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    payload: adminPermissionsList,
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    payload: noPermissionsList,
  },
];

export const PermissionsSettings = () => {
  return (
    <PermissionsDataProvider>
      <PermissionsFormProvider>
        <SectionContainer>
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
      </PermissionsFormProvider>
    </PermissionsDataProvider>
  );
};
