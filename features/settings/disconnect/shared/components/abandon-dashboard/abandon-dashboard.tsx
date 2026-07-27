import { Step } from 'shared/components';

import {
  TransferAddress,
  TransferDescription,
  WarningBanner,
  TransferAction,
} from './components';

import { AbandonContainer } from './styles';

export const AbandonDashboard = () => {
  return (
    <Step
      number={3}
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
