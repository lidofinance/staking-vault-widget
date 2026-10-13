import type { StepStatus } from 'shared/components';

import { DISCONNECT_STEP, DISCONNECT_STATUS } from './const';

export type DisconnectStep =
  (typeof DISCONNECT_STEP)[keyof typeof DISCONNECT_STEP];

export type DisconnectStatus =
  (typeof DISCONNECT_STATUS)[keyof typeof DISCONNECT_STATUS];

// props of the shared `Step` component that the stepper controls
export type DisconnectStepState = {
  number: DisconnectStep;
  status: StepStatus;
  isAllowExpand: boolean;
  defaultExpanded: boolean;
};

export type DisconnectStepsState = {
  // the step the user has reached, `null` while the vault state is unknown
  activeStep: DisconnectStep | null;
  status: DisconnectStatus;
  availableBalance: bigint;
  steps: Record<DisconnectStep, DisconnectStepState>;
};
