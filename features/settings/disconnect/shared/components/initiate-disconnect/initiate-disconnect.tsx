import { Step } from 'shared/components';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import {
  AfterDisconnect,
  CheckAvailability,
  DisconnectAction,
  WarningBanner,
} from './components';

import { Container } from './styles';

export const InitiateDisconnect = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.INITIATE_DISCONNECT);

  return (
    <Step
      {...stepProps}
      title="Initiate voluntary disconnect"
      dataTestId="disconnect-step-1"
    >
      <Container data-testid="initiate-disconnect">
        <CheckAvailability />
        <AfterDisconnect />
        <WarningBanner />
        <DisconnectAction />
      </Container>
    </Step>
  );
};
