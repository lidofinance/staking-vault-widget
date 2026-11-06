// Resume of a supply operation (unwrap → fund → mint) after a failed step, shared by the
// sender and the form, so the form shows and validates what a resubmit will actually send.
import { toResumeKey } from 'modules/web3/utils/to-resume-key';

export type SupplyResumeValues = {
  amount: bigint | null;
  mintSteth: boolean;
  token: string;
  mintAddress: unknown;
};

// One key for the sender (validated values) and the form (raw field values):
// the recipient is normalized as the address schema does, and ignored when not minting.
export const getSupplyResumeKey = (
  vault: string,
  { amount, mintSteth, token, mintAddress }: SupplyResumeValues,
): string =>
  toResumeKey({
    vault,
    amount,
    mintSteth,
    token,
    mintAddress: mintSteth
      ? String(mintAddress ?? '')
          .trim()
          .toLowerCase()
      : null,
  });

// the wallet balance a resubmit spends the amount from, so the form checks it against that one
export type SupplyBalanceCheck =
  | 'token' // nothing confirmed: the selected token (ETH, or wETH to unwrap)
  | 'eth' // wETH unwrapped, fund failed: the fund is sent from the ETH the unwrap gave
  | 'none'; // funded, only minting is left: no balance is spent

export const getSupplyResumeState = (completedSteps: ReadonlySet<string>) => {
  const isFunded = completedSteps.has('fund');
  const isUnwrapped = completedSteps.has('unwrap');
  const balanceCheck: SupplyBalanceCheck = isFunded
    ? 'none'
    : isUnwrapped
      ? 'eth'
      : 'token';
  return {
    // the amount is already in the vault, only minting is left
    isFunded,
    balanceCheck,
  };
};

// funding the mint capacity is computed with: a confirmed fund is already counted
// by the vault, adding it again would overestimate the capacity
export const getMintFunding = (
  amount: bigint,
  completedSteps: ReadonlySet<string>,
): bigint => (getSupplyResumeState(completedSteps).isFunded ? 0n : amount);

// The mint option is turned off automatically when nothing can be minted, but not while
// the fund of these values is confirmed: turning it off changes the values, so the resume
// is lost and a Retry would send the fund again (without the mint the user asked for).
// The resume then retries the mint, which fails again with its own error if still not mintable.
export const shouldTurnOffMint = ({
  mintSteth,
  isStethMintable,
  isFunded,
}: {
  mintSteth: boolean;
  isStethMintable: boolean;
  isFunded: boolean;
}) => mintSteth && !isStethMintable && !isFunded;
