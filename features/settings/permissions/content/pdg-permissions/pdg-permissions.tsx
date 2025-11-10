import {
  PDGAddress,
  RoleDescription,
} from 'features/settings/permissions/components';
import { PGDRolesKeys } from 'features/settings/permissions/types';

import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from '../styles';

const dataTestId = 'pdgPermissions';
const noPermissions: { title: string; fieldName: PGDRolesKeys }[] = [
  {
    title: 'Guarantor',
    fieldName: 'noGuarantor',
  },
  {
    title: 'Depositor',
    fieldName: 'noDepositor',
  },
];

export const PDGPermissions = () => {
  return (
    <PermissionContainer data-testid={`${dataTestId}-container`}>
      <PermissionGroupTitle data-testid={`${dataTestId}-title`}>
        {'Predeposit guarantee permissions'}
      </PermissionGroupTitle>
      <PermissionBlock data-testid={`${dataTestId}-block`}>
        {noPermissions.map(({ title, fieldName }) => {
          const testId = `${dataTestId}-${fieldName}`;

          return (
            <PermissionRoleWrapper
              key={fieldName}
              $align="center"
              data-testid={`${testId}-roleWrapper`}
            >
              <RoleDescription
                description={title}
                tooltip={'hint'}
                dataTestId={testId}
              />
              <PDGAddress permissionFormField={fieldName} dataTestId={testId} />
            </PermissionRoleWrapper>
          );
        })}
      </PermissionBlock>
    </PermissionContainer>
  );
};
