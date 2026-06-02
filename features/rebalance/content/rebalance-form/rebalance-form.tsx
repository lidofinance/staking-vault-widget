import { type FC } from 'react';

import { RebalanceFormWrapper } from './rebalance-form-wrapper';
import {
  ActionSubmit,
  VaultMetrics,
  RebalanceDescription,
  Supply,
  RebalanceInput,
} from 'features/rebalance/shared';

export const RebalanceForm: FC = () => {
  return (
    <RebalanceFormWrapper>
      <RebalanceDescription />
      <RebalanceInput />
      <Supply />
      <VaultMetrics />
      <ActionSubmit />
    </RebalanceFormWrapper>
  );
};
