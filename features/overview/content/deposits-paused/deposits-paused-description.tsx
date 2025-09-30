import Link from 'next/link';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

export const DepositsPausedDescription = () => {
  const { activeVault } = useVault();

  if (!activeVault) {
    return null;
  }

  return (
    <>
      Node Operator cannot deposit ETH from the stVault Balance to validators.
      Сonsolidations remain allowed.
      <Link href={appPaths.vaults.vault(activeVault.address).settings('main')}>
        Go to settings
      </Link>{' '}
      to allow deposits.
    </>
  );
};
