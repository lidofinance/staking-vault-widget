import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from './styles';
import { PermissionsRoles } from 'features/create-vault/types';

import {
  NO_MANAGER_PERMISSION_LIST,
  VAULT_MANAGER_PERMISSIONS_LIST,
} from 'modules/vaults';
import { SectionContainer } from '../../styles';
import { AddressList } from './address-list';
import { PermissionsAction } from './permissions-action';
import { RoleDescription } from './role-description';

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

type PermissionsProps = {
  isShown: boolean;
};

export const Permissions = ({ isShown }: PermissionsProps) => {
  return (
    <SectionContainer isShown={isShown}>
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
