import { FC } from 'react';
import { useVaultInfo } from 'features/overview/contexts';

import { FormBlock, PageWrapper } from './styles';
import { Fund } from './fund';
import { Withdraw } from './withdraw';

import { supplyToggleList } from './const';
import { ManifestConfigPageEnum } from 'config/external-config';
import { Switch } from 'shared/components/switch';
export interface SupplyTabProps {
  mode: 'fund' | 'withdraw';
}

export const SupplyTabs: FC<SupplyTabProps> = ({ mode }) => {
  const isFundTab = mode === 'fund';
  const { activeVault } = useVaultInfo();

  const supplyRoutes = [
    {
      path: `/${activeVault?.address}${ManifestConfigPageEnum.supply}/${supplyToggleList[0].value}`,
      name: supplyToggleList[0].label,
    },
    {
      path: `/${activeVault?.address}${ManifestConfigPageEnum.supply}/${supplyToggleList[1].value}`,
      name: supplyToggleList[1].label,
    },
  ];

  return (
    <PageWrapper>
      <Switch checked={!isFundTab} routes={supplyRoutes} />

      <FormBlock>{isFundTab ? <Fund /> : <Withdraw />}</FormBlock>
    </PageWrapper>
  );
};
