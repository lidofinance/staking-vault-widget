import { ManagerAddressField } from '../controllers';

import { adminsForRender } from 'features/settings/main/consts';

export const Admins = () => {
  return (
    <>
      {adminsForRender.map((field) => (
        <ManagerAddressField key={field.vaultKey} {...field} />
      ))}
    </>
  );
};
