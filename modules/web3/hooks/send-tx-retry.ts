// Pure retry/resume rules of useSendTransaction, kept apart from the hook to be unit tested

export type ResumeProgress = {
  key: string;
  completedSteps: Set<string>;
};

// progress is reused only for the same key (account + submitted values), otherwise it starts over
export const resolveResumeProgress = (
  current: ResumeProgress | undefined,
  key: string | undefined,
): ResumeProgress | undefined => {
  if (key === undefined) return undefined;
  if (current?.key === key) return current;
  return { key, completedSteps: new Set() };
};

export const skipCompletedSteps = <T extends { stepKey?: string }>(
  transactions: T[],
  completedSteps: ReadonlySet<string>,
): T[] =>
  transactions.filter((tx) => !tx.stepKey || !completedSteps.has(tx.stepKey));

type CallReceipt = { status: 'success' | 'reverted' };

// failed AA batch: which calls were executed and whether the outcome is known at all
export const getFailedBatchOutcome = <R extends CallReceipt>(callStatus: {
  receipts?: R[];
  statusCode: number;
}) => {
  const executedReceipts =
    callStatus.receipts?.filter((receipt) => receipt.status === 'success') ??
    [];
  return {
    executedReceipts,
    // 600 is a partial revert: some calls are executed, but without receipts we can't tell which
    isUnknown: executedReceipts.length === 0 && callStatus.statusCode === 600,
  };
};

export type RetryDecisionInput = {
  // isRetryable of DisplayableError, undefined for generic errors
  isRetryableError: boolean | undefined;
  // a tx (hash or call id) was sent, but its result is unknown
  isUnconfirmed: boolean;
  // receipts of legacy txs, including the reverted one
  receipts: CallReceipt[];
  // executed calls of a partially failed AA batch
  executedCallsCount: number;
  isAA: boolean;
  // resume by steps is used (resumeKey is set)
  isTracked: boolean;
  allowRetryAfterPartialSuccess: boolean;
};

export const getRetryDecision = ({
  isRetryableError,
  isUnconfirmed,
  receipts,
  executedCallsCount,
  isAA,
  isTracked,
  allowRetryAfterPartialSuccess,
}: RetryDecisionInput) => {
  const isPartialSuccess =
    receipts.some((receipt) => receipt.status === 'success') ||
    executedCallsCount > 0;
  // executed calls of a partially failed AA batch can't be mapped to steps,
  // so a resume would send them again
  const isUntrackedPartialSuccess = isPartialSuccess && isAA && isTracked;

  // retry signs new txs, so it must not replay a tx that may be executed
  // or steps that are already applied
  const canRetry =
    (isRetryableError ?? true) &&
    !isUnconfirmed &&
    !isUntrackedPartialSuccess &&
    (!isPartialSuccess || allowRetryAfterPartialSuccess);

  return { canRetry, isPartialSuccess };
};
