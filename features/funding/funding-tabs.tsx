import { type FC, useMemo } from 'react';
import { zeroAddress } from 'viem';
import { useVault } from 'modules/vaults';

import { Switch, VaultConnectionBanner } from 'shared/components';
import { appPaths } from 'consts/routing';

import { Supply } from './supply';
import { Withdraw } from './withdraw';

import { PageWrapper } from './styles';

export type FundingTabsProps = {
  mode: 'supply' | 'withdraw';
};

export const FundingTabs: FC<FundingTabsProps> = ({ mode }) => {
  const isFundTab = mode === 'supply';
  const { activeVault, vaultAddress } = useVault();

  const fundingRoutes = useMemo(
    () => [
      {
        path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).eth('supply'),
        name: 'Supply',
      },
      {
        path: appPaths.vaults
          .vault(vaultAddress ?? zeroAddress)
          .eth('withdraw'),
        name: 'Withdraw',
      },
    ],
    [vaultAddress],
  );

  return (
    <PageWrapper>
      <VaultConnectionBanner />
      {!activeVault?.isVaultDisconnected && (
        <>
          <Switch checked={!isFundTab} routes={fundingRoutes} />
          {isFundTab ? <Supply /> : <Withdraw />}
        </>
      )}
    </PageWrapper>
  );
};
