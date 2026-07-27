import { Stepper } from 'shared/components';

import {
  AbandonDashboard,
  AcceptOwnership,
  ApplyReport,
  InitiateDisconnect,
  RecoverFees,
  Withdraw,
} from 'features/settings/disconnect/shared';

import { StepsContainer } from './styles';

export const DisconnectSteps = () => {
  return (
    <StepsContainer>
      <Stepper>
        <InitiateDisconnect />
        <ApplyReport />
        <AbandonDashboard />
        <AcceptOwnership />
        <Withdraw />
        <RecoverFees />
      </Stepper>
    </StepsContainer>
  );
};
