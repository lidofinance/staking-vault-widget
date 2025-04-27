import { FC } from 'react';

import { VaultInfo } from 'types';
import { RoleAddress } from './role-address';
import { RoleFieldSchema } from '../../../types';
import { useFormContext } from 'react-hook-form';

interface DisplayAddressProps {
  vaultKey: keyof VaultInfo;
  isEditable: boolean;
}

export const DisplayAddress: FC<DisplayAddressProps> = ({
  isEditable,
  vaultKey,
}) => {
  const { watch } = useFormContext();
  const roles = watch(vaultKey) as RoleFieldSchema[];

  return (
    <>
      {!!roles &&
        roles.map((role, index) => {
          return (
            <RoleAddress
              key={role.value}
              role={role}
              roles={roles}
              index={index}
              vaultKey={vaultKey}
              isEditable={isEditable}
            />
          );
        })}
    </>
  );
};
