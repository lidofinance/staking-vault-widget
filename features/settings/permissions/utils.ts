import {
  EditPermissionsSchema,
  GrantRole,
  PermissionsKeys,
} from 'features/settings/permissions/types';
import { permissions } from 'consts/roles';
import { Address } from 'viem';

export const collectFormValuesToRpc = (formData: EditPermissionsSchema) => {
  const keys = Object.keys(formData) as PermissionsKeys[];

  return keys.reduce((acc, key) => {
    const permissionHex = permissions[key];
    const addresses = formData[key] as Address[] | undefined;

    if (addresses && addresses.length > 0) {
      const rolesList = addresses.map((address) => ({
        account: address,
        role: permissionHex,
      }));

      acc.push(...rolesList);
    }

    return acc;
  }, [] as GrantRole[]);
};
