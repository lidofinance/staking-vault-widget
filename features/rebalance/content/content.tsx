import type { FC, PropsWithChildren } from 'react';

import { Divider } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { HealthState } from './health-state';
import { RebalanceForm } from './rebalance-form';
import { ContentContainer } from '../shared';

export const RebalanceContent: FC<PropsWithChildren> = () => {
  const { activeVault } = useVault();

  if (activeVault?.isVaultDisconnected) {
    return null;
  }

  return (
    <ContentContainer>
      <HealthState />
      <Divider />
      <RebalanceForm />
    </ContentContainer>
  );
};
