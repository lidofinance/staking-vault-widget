import { type FC } from 'react';

import {
  FormWrapper,
  ActionSubmit,
  VaultMetrics,
  RebalanceDescription,
  Supply,
  RebalanceInput,
} from 'features/rebalance/shared';

export const RebalanceForm: FC = () => {
  return (
    <FormWrapper>
      <RebalanceDescription />
      <RebalanceInput />
      <Supply />
      <VaultMetrics />
      <ActionSubmit />
    </FormWrapper>
  );
};
