// Resume of a withdraw operation (withdraw → wrap) after a failed step, shared by the
// sender and the form, so the form validates what a resubmit will actually send.
import { toResumeKey } from 'modules/web3/utils/to-resume-key';

export type WithdrawResumeValues = {
  amount: bigint | null;
  recipient: unknown;
  token: string;
};

// One key for the sender (validated values) and the form (raw field values):
// the recipient is normalized as the address schema does (trim + lowercase).
export const getWithdrawResumeKey = (
  vault: string,
  { amount, recipient, token }: WithdrawResumeValues,
): string =>
  toResumeKey({
    vault,
    amount,
    recipient: String(recipient ?? '')
      .trim()
      .toLowerCase(),
    token,
  });

// a confirmed withdraw has already taken the amount out of the withdrawable balance
// the form checks it against, and a resubmit only wraps
export const skipsWithdrawableCheck = (completedSteps: ReadonlySet<string>) =>
  completedSteps.has('withdraw');
