import { useAdjustment } from 'features/adjustment/contexts/adjustment-provider';
import { useVaultInfo } from 'features/overview/contexts';

import { Switch } from 'shared/components/switch';
import { ManifestConfigPageEnum } from 'config/external-config';

import { Mint } from './mint';
import { Repay } from './repay';
import { adjustmentToggleList } from './const';
import { FormBlock, PageWrapper } from './styles';

export const AdjustmentTabs = () => {
  const { isMintTab } = useAdjustment();
  const { activeVault } = useVaultInfo();

  const mintRoutes = [
    {
      path: `/${activeVault?.address}${ManifestConfigPageEnum.adjustment}/${adjustmentToggleList[0].value}`,
      name: adjustmentToggleList[0].label,
    },
    {
      path: `/${activeVault?.address}${ManifestConfigPageEnum.adjustment}/${adjustmentToggleList[1].value}`,
      name: adjustmentToggleList[1].label,
    },
  ];

  return (
    <PageWrapper>
      <Switch checked={!isMintTab} routes={mintRoutes} />
      <FormBlock>{isMintTab ? <Mint /> : <Repay />}</FormBlock>
    </PageWrapper>
  );
};
