import { type FC, useMemo } from 'react';
import { zeroAddress } from 'viem';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';
import { Switch, VaultConnectionBanner } from 'shared/components';

import { Mint } from './mint';
import { Repay } from './repay';
import { PageWrapper } from './styles';

type AdjustmentTabsProps = {
  isMintTab: boolean;
};

export const AdjustmentTabs: FC<AdjustmentTabsProps> = ({ isMintTab }) => {
  const { activeVault, vaultAddress } = useVault();

  const mintRoutes = useMemo(
    () => [
      {
        path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).steth('mint'),
        name: 'Mint',
      },
      {
        path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).steth('repay'),
        name: 'Repay',
      },
    ],
    [vaultAddress],
  );

  return (
    <PageWrapper>
      <VaultConnectionBanner />
      {!activeVault?.isVaultDisconnected && (
        <>
          <Switch checked={!isMintTab} routes={mintRoutes} />
          {isMintTab ? <Mint /> : <Repay />}
        </>
      )}
    </PageWrapper>
  );
};
