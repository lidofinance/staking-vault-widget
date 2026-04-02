import { zeroAddress } from 'viem';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';
import { Switch, DisconnectedVault } from 'shared/components';

import { Mint } from './mint';
import { Repay } from './repay';
import { PageWrapper } from './styles';

type AdjustmentTabsProps = {
  isMintTab: boolean;
};

export const AdjustmentTabs = ({ isMintTab }: AdjustmentTabsProps) => {
  const { vaultAddress } = useVault();

  const mintRoutes = [
    {
      path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).steth('mint'),
      name: 'Mint',
    },
    {
      path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).steth('repay'),
      name: 'Repay',
    },
  ];

  return (
    <PageWrapper>
      <DisconnectedVault />
      <Switch checked={!isMintTab} routes={mintRoutes} />
      {isMintTab ? <Mint /> : <Repay />}
    </PageWrapper>
  );
};
