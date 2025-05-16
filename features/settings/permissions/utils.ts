import {
  EditPermissionsSchema,
  FieldSchema,
  GrantRole,
  PermissionAccounts,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { EDITABLE_ROLES_LIST, EDITABLE_ROLES_MAP } from './consts';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

export const collectFormValuesToRpc = (formData: EditPermissionsSchema) => {
  return Object.entries(formData).reduce(
    (acc, [key, fieldList]) => {
      const role = EDITABLE_ROLES_MAP[key as PermissionKeys];
      invariant(role, '[collectFormValuesToRpc] role not found');
      const { toRevoke, toGrant } = acc;
      fieldList?.forEach((field) => {
        if (field.action === 'grant') {
          toGrant.push({
            account: field.account,
            role,
          });
        }

        if (field.action === 'revoke') {
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

export const formatRawPermissions = (
  list: { status: string; result: Address[] }[] = [],
) => {
  return list.map((item, index) => {
    if (item.status === 'success') {
      return {
        permissionName: EDITABLE_ROLES_LIST[index],
        addressList: item.result,
      };
    }
  }) as PermissionAccounts[];
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
            action: 'display',
          }) as FieldSchema,
      );

      return acc;
    },
    {} as Record<PermissionKeys, FieldSchema[]>,
  );
};
