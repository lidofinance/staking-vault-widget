import { Step } from 'shared/components';

import { DISCONNECT_STEP } from 'features/settings/shared/const';
import { useDisconnectStep } from 'features/settings/shared/hooks';

import { OwnershipDescription, OwnershipAction } from './components';

import { AcceptContainer } from './styles';

export const AcceptOwnership = () => {
  const stepProps = useDisconnectStep(DISCONNECT_STEP.ACCEPT_OWNERSHIP);

  return (
    <Step {...stepProps} title="Accept ownership by a new owner">
      <AcceptContainer>
        <OwnershipDescription />
        <OwnershipAction />
      </AcceptContainer>
    </Step>
  );
};
