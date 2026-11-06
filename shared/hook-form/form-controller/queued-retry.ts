import type { TransactionModalState } from 'shared/components/transaction-modal/types';

// Retry clicked while the form was busy, with the modal it was clicked in
export type QueuedRetry = {
  // the modal is shared by all senders, and each sender's retry callback is stable,
  // so it tells this form's error from another sender's
  onRetry: NonNullable<TransactionModalState['onRetry']>;
  // the error it was clicked on: a retry clicked on an old error must not run
  // after a newer attempt (e.g. the first of two clicks) has already started
  sessionId: number;
};

// The queued retry runs only while the modal still offers that same retry for that same error:
// retry may be disabled after the refetch (e.g. data is not fresh), the modal was closed,
// it shows another sender's error (e.g. the side nav report action), or a newer attempt began
export const canRunQueuedRetry = (
  modal: Pick<
    TransactionModalState,
    'isOpen' | 'stage' | 'onRetry' | 'sessionId'
  >,
  queued: QueuedRetry,
): boolean =>
  modal.isOpen &&
  modal.stage === 'error' &&
  modal.onRetry !== undefined &&
  modal.onRetry === queued.onRetry &&
  modal.sessionId === queued.sessionId;

// how a submit started by FormController ended
export type SubmitOutcome =
  | 'skipped' // the form was busy or disabled
  | 'invalid' // form validation rejected the values, the sender was not reached
  | 'submitted';

// A retry rejected by form validation never reaches the sender, so no new modal session
// starts and the modal keeps covering the form errors. It is closed then, so the user
// sees them and submits again, but only if it still shows the error the retry was clicked on.
export const shouldCloseAfterRetry = (
  outcome: SubmitOutcome,
  clickedSession: number,
  currentSession: number,
): boolean => outcome === 'invalid' && clickedSession === currentSession;
