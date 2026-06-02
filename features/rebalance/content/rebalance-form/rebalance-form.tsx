import { type FC } from 'react';

import {
  VerificationErrorBanners,
  VerificationWarningBanners,
} from 'shared/components';

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
      <VerificationErrorBanners action="rebalance" />
      <RebalanceDescription />
      <RebalanceInput />
      <Supply />
      <VaultMetrics />
      <VerificationWarningBanners action="rebalance" />
      <ActionSubmit />
    </FormWrapper>
  );
};
