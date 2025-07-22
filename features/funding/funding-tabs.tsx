import { FC } from 'react';
import { useVault } from 'modules/vaults';

import { PageWrapper } from './styles';
import { Fund } from './fund';
import { Withdraw } from './withdraw';

import { Switch } from 'shared/components/switch';
import { appPaths } from 'consts/routing';
import { zeroAddress } from 'viem';

export type FundingTabsProps = {
  mode: 'supply' | 'withdraw';
};

export const FundingTabs: FC<FundingTabsProps> = ({ mode }) => {
  const isFundTab = mode === 'supply';
  const { vaultAddress } = useVault();

  const fundingRoutes = [
    {
      path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).eth('supply'),
      name: 'Supply',
    },
    {
      path: appPaths.vaults.vault(vaultAddress ?? zeroAddress).eth('withdraw'),
      name: 'Withdraw',
    },
  ];

  return (
    <PageWrapper>
      <Switch checked={!isFundTab} routes={fundingRoutes} />

      {isFundTab ? <Fund /> : <Withdraw />}
    </PageWrapper>
  );
};
