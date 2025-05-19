import { useAdjustment } from 'features/adjustment/contexts/adjustment-provider';
import { useVaultInfo } from 'modules/vaults';

import { Switch } from 'shared/components/switch';

import { Mint } from './mint';
import { Repay } from './repay';
import { FormBlock, PageWrapper } from './styles';
import { appPaths } from 'consts/routing';
import { zeroAddress } from 'viem';

export const AdjustmentTabs = () => {
  const { isMintTab } = useAdjustment();
  const { vaultAddress } = useVaultInfo();

  // TODO: improve creation of the path
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
