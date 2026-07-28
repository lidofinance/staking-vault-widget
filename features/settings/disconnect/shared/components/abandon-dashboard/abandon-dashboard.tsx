import { Step } from 'shared/components';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import {
  TransferAddress,
  TransferDescription,
  WarningBanner,
  TransferAction,
} from './components';

import { AbandonContainer } from './styles';

export const AbandonDashboard = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.ABANDON_DASHBOARD);

  return (
    <Step
      {...stepProps}
      title="Abandon Dashboard contract and transfer the stVault ownership"
    >
      <AbandonContainer>
        <TransferDescription />
        <TransferAddress />
        <WarningBanner />
        <TransferAction />
      </AbandonContainer>
    </Step>
  );
};
