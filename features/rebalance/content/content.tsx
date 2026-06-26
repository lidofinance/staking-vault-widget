import type { FC, PropsWithChildren } from 'react';

import { Divider } from '@lidofinance/lido-ui';

import { HealthState } from './health-state';
import { RebalanceForm } from './rebalance-form';
import { ContentContainer } from '../shared';

export const RebalanceContent: FC<PropsWithChildren> = () => {
  return (
    <ContentContainer>
      <HealthState />
      <Divider />
      <RebalanceForm />
    </ContentContainer>
  );
};
