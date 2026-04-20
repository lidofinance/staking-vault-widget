import type { FC } from 'react';

import { WarningInfo } from 'features/validators/shared';

type VaultInJailProps = {
  isVaultInJail: boolean;
};

export const VaultInJail: FC<VaultInJailProps> = ({ isVaultInJail }) => {
  if (!isVaultInJail) {
    return null;
  }

  return <WarningInfo>Vault currently in Jail</WarningInfo>;
};
