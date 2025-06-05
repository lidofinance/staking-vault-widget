import { FC } from 'react';
import { useVaultInfo } from 'modules/vaults';

import { FormBlock, PageWrapper } from './styles';
import { Fund } from './fund';
import { Withdraw } from './withdraw';

import { Switch } from 'shared/components/switch';
import { appPaths } from 'consts/routing';
import { zeroAddress } from 'viem';

export type SupplyTabProps = {
  mode: 'supply' | 'withdraw';
};

export const SupplyTabs: FC<SupplyTabProps> = ({ mode }) => {
  const isFundTab = mode === 'supply';
  const { vaultAddress } = useVaultInfo();

  const supplyRoutes = [
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
      <Switch checked={!isFundTab} routes={supplyRoutes} />

      <FormBlock>{isFundTab ? <Fund /> : <Withdraw />}</FormBlock>
    </PageWrapper>
  );
};
