import type { FC } from 'react';
import { Link } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { config } from 'config';

import { WarningInfo } from 'features/validators/shared';

type VaultInJailProps = {
  isVaultInJail: boolean;
};

const { vaultIsJail } = vaultTexts.actions.validators.modals.withdrawal;
const { docsOrigin } = config;

const docsLink = `${docsOrigin}/contracts/operator-grid#jailing`;

export const VaultInJail: FC<VaultInJailProps> = ({ isVaultInJail }) => {
  if (!isVaultInJail) {
    return null;
  }

  return (
    <WarningInfo>
      {vaultIsJail} <Link href={docsLink}>Learn more</Link>
    </WarningInfo>
  );
};
