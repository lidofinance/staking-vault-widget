import { zeroAddress } from 'viem';

import { useVaultInfo } from 'modules/vaults';
import { appPaths } from 'consts/routing';
import { Switch } from 'shared/components/switch';

import { Mint } from './mint';
import { Repay } from './repay';
import { FormBlock, PageWrapper } from './styles';

type AdjustmentTabsProps = {
  isMintTab: boolean;
};

export const AdjustmentTabs = ({ isMintTab }: AdjustmentTabsProps) => {
  const { vaultAddress } = useVaultInfo();

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
      <Switch checked={!isMintTab} routes={mintRoutes} />
      <FormBlock>{isMintTab ? <Mint /> : <Repay />}</FormBlock>
    </PageWrapper>
  );
};
