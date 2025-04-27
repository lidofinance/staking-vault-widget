import { FC, useEffect } from 'react';
import { Address } from 'viem';

import { useVaultInfo } from 'features/overview/contexts';
import { VaultInfo } from 'types';
import { useFormContext } from 'react-hook-form';
import { RoleFieldSchema } from 'features/settings/main/types';
import { RoleAddress } from './role-address';

interface DisplayAddressProps {
  name: string;
  vaultKey: keyof VaultInfo;
}

export const DisplayAddress: FC<DisplayAddressProps> = ({ vaultKey, name }) => {
  const { activeVault } = useVaultInfo();
  const { setValue, watch } = useFormContext();
  const roles = watch(name) as RoleFieldSchema[] | undefined;

  useEffect(() => {
    const addresses = activeVault?.[vaultKey] as Address[] | undefined;
    if (Array.isArray(addresses)) {
      const values = addresses.map(
        (address) =>
          ({
            isGranted: true,
            value: address,
            state: 'display',
          }) as RoleFieldSchema,
      );

      setValue(name, values, { shouldDirty: true, shouldTouch: true });
    }
  }, [activeVault, setValue, vaultKey, name]);

  return (
    <>
      {!!roles &&
        roles.map((role, index) => (
          <RoleAddress
            key={role.value}
            index={index}
            roles={roles}
            role={role}
            vaultKey={vaultKey}
          />
        ))}
    </>
  );
};
