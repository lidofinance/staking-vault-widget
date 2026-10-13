import { Fragment } from 'react';

import { Stepper } from 'shared/components';

import {
  AbandonDashboard,
  AcceptOwnership,
  ApplyReport,
  InitiateDisconnect,
  RecoverFees,
  Withdraw,
} from 'features/settings/disconnect/shared';

import { DISCONNECT_STEPS_COUNT } from 'features/settings/shared/const';
import { useDisconnectSteps } from 'features/settings/shared/hooks';

import { StepsContainer } from './styles';

export const DisconnectSteps = () => {
  const { data } = useDisconnectSteps();

  return (
    <StepsContainer>
      <Stepper stepsCount={DISCONNECT_STEPS_COUNT}>
        {/* `Step` seeds its expanded state from `defaultExpanded` on mount, so
            the steps are remounted whenever the active step changes to let the
            stepper follow the flow */}
        <Fragment key={data?.activeStep ?? 'unknown-step'}>
          <InitiateDisconnect />
          <ApplyReport />
          <AbandonDashboard />
          <AcceptOwnership />
          <Withdraw />
          <RecoverFees />
        </Fragment>
      </Stepper>
    </StepsContainer>
  );
};
