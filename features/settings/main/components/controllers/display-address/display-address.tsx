import { FC, useMemo } from 'react';
import { Address } from 'viem';

import { useVaultInfo } from 'features/overview/contexts';
import { VaultInfo } from 'types';
import { RoleAddress } from './role-address';

interface DisplayAddressProps {
  name: string;
  vaultKey: keyof VaultInfo;
}

export const DisplayAddress: FC<DisplayAddressProps> = ({ vaultKey }) => {
  const { activeVault } = useVaultInfo();
  const renderData = useMemo(() => {
    return activeVault?.[vaultKey] as Address[] | Address | undefined;
  }, [activeVault, vaultKey]);

  if (Array.isArray(renderData)) {
    return (
      <>
        {renderData.map((address) => (
          <RoleAddress key={address} address={address} />
        ))}
      </>
    );
  }

  return <RoleAddress address={renderData} />;
};
