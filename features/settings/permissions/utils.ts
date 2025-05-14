import {
  EditPermissionsSchema,
  FieldSchema,
  GrantRole,
  PermissionAccounts,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { EDITABLE_ROLES_MAP } from './consts';
import invariant from 'tiny-invariant';

export const collectFormValuesToRpc = (formData: EditPermissionsSchema) => {
  return Object.entries(formData).reduce(
    (acc, [key, fieldList]) => {
      const role = EDITABLE_ROLES_MAP[key as PermissionKeys];
      invariant(role, '[collectFormValuesToRpc] role not found');
      const { toRevoke, toGrant } = acc;
      fieldList?.forEach((field) => {
        if (field.state === 'grant') {
          toGrant.push({
            account: field.account,
            role,
          });
        }

        if (field.state === 'remove') {
          toRevoke.push({
            account: field.account,
            role,
          });
        }
      });

      return { toRevoke, toGrant };
    },
    { toRevoke: [], toGrant: [] } as {
      toRevoke: GrantRole[];
      toGrant: GrantRole[];
    },
  );
};

export const collectRolesToFormValues = (
  rolesList: PermissionAccounts[] = [],
) => {
  if (rolesList.length === 0) {
    return null;
  }

  return rolesList.reduce(
    (acc, role) => {
      const { addressList, permissionName } = role;
      acc[permissionName] = addressList.map(
        (address) =>
          ({
            account: address,
            group: 'settled',
            state: 'display',
          }) as FieldSchema,
      );

      return acc;
    },
    {} as Record<PermissionKeys, FieldSchema[]>,
  );
};
