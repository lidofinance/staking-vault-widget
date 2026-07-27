import { Step } from 'shared/components';

import {
  AfterDisconnect,
  CheckAvailability,
  DisconnectAction,
  WarningBanner,
} from './components';

import { Container } from './styles';

export const InitiateDisconnect = () => {
  return (
    <Step number={1} title="Initiate voluntary disconnect">
      <Container>
        <CheckAvailability />
        <AfterDisconnect />
        <WarningBanner />
        <DisconnectAction />
      </Container>
    </Step>
  );
};
