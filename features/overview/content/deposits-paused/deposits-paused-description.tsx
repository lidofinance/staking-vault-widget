import Link from 'next/link';

import { useVault, useVaultPermission } from 'modules/vaults';
import { appPaths } from 'consts/routing';

export const DepositsPausedDescription = () => {
  const { activeVault } = useVault();
  const { hasPermission } = useVaultPermission('depositsResumer');

  if (!activeVault) {
    return null;
  }

  return (
    <>
      Node Operator cannot deposit ETH from the stVault Balance to validators.
      Сonsolidations remain allowed.{' '}
      {hasPermission && (
        <>
          <Link
            href={appPaths.vaults.vault(activeVault.address).settings('main')}
          >
            Go to settings
          </Link>{' '}
          to allow deposits.
        </>
      )}
    </>
  );
};
