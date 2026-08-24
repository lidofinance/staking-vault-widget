import { useVault } from 'modules/vaults';

import { DisburseForm } from './form';

export const Disburse = () => {
  const { activeVault } = useVault();

  if (activeVault?.isVaultDisconnected) {
    return null;
  }

  return <DisburseForm />;
};
