import { type FC } from 'react';

import {
  FormWrapper,
  ActionSubmit,
  VaultMetrics,
  RebalanceDescription,
  Supply,
  RebalanceInput,
  RebalanceVerificationBanners,
} from 'features/rebalance/shared';

export const RebalanceForm: FC = () => {
  return (
    <FormWrapper>
      <RebalanceVerificationBanners variant="error" />
      <RebalanceDescription />
      <RebalanceInput />
      <Supply />
      <VaultMetrics />
      <RebalanceVerificationBanners variant="warning" />
      <ActionSubmit />
    </FormWrapper>
  );
};
