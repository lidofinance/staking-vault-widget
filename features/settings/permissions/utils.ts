import {
  EditPermissionsSchema,
  GrantRole,
} from 'features/settings/permissions/types';
import { PERMISSION, permissions } from 'consts/roles';

export const collectFormValuesToRpc = (formData: EditPermissionsSchema) => {
  const keys = Object.keys(formData) as PERMISSION[];

  return keys.reduce(
    (acc, key) => {
      const fieldList = formData[key];
      const { toRevoke, toGrant } = acc;
      fieldList?.forEach((field) => {
        if (field.state === 'grant') {
          toGrant.push({ account: field.account, role: permissions[key] });
        }

        if (field.state === 'remove') {
          toRevoke.push({ account: field.account, role: permissions[key] });
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
