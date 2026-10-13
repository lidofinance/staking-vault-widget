// numbers match the order the steps are rendered in `DisconnectSteps`
export const DISCONNECT_STEP = {
  INITIATE_DISCONNECT: 1,
  APPLY_REPORT: 2,
  ABANDON_DASHBOARD: 3,
  ACCEPT_OWNERSHIP: 4,
  WITHDRAW: 5,
  RECOVER_FEES: 6,
} as const;

export const DISCONNECT_STEPS_ORDER = [
  DISCONNECT_STEP.INITIATE_DISCONNECT,
  DISCONNECT_STEP.APPLY_REPORT,
  DISCONNECT_STEP.ABANDON_DASHBOARD,
  DISCONNECT_STEP.ACCEPT_OWNERSHIP,
  DISCONNECT_STEP.WITHDRAW,
  DISCONNECT_STEP.RECOVER_FEES,
] as const;

export const DISCONNECT_STEPS_COUNT = DISCONNECT_STEPS_ORDER.length;

export const DISCONNECT_STATUS = {
  // the vault is still connected and the disconnect is not requested yet
  NOT_INITIATED: 'not-initiated',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
} as const;
