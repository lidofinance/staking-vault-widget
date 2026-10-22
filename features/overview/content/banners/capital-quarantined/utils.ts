import type { VaultQuarantineState } from 'modules/vaults';

type OnchainQuarantine = {
  quarantine: VaultQuarantineState;
  totalValue: bigint;
};

export type QuarantineBannerState =
  | { type: 'releasable'; total: bigint; releasable: bigint }
  | {
      type: 'default';
      total: bigint;
      pending: bigint;
      expectedReportTimestamp?: bigint;
    };

const maxBigint = (...values: bigint[]) =>
  values.reduce((a, b) => (a > b ? a : b));
const minBigint = (...values: bigint[]) =>
  values.reduce((a, b) => (a < b ? a : b));

// vaults report timestamp is the refSlot timestamp, so reports are spaced by the frame duration;
// the release needs the first report with timestamp >= endTimestamp,
// it can't be the latest one, nor older than the current frame (e.g. when the oracle is late)
export const getExpectedReportTimestamp = ({
  hubReportTimestamp,
  endTimestamp,
  frameDuration,
  now,
}: {
  hubReportTimestamp: bigint;
  endTimestamp: bigint;
  frameDuration: bigint;
  now: bigint;
}) => {
  const lowerBound = maxBigint(
    endTimestamp,
    hubReportTimestamp + 1n,
    now - frameDuration + 1n,
  );
  const frames =
    (lowerBound - hubReportTimestamp + frameDuration - 1n) / frameDuration;

  return hubReportTimestamp + frames * frameDuration;
};

// applying the report to an expired quarantine either releases it with the new reported value
// or keeps quarantinedValue and starts a new quarantine for the rest, so the released amount is
// the total value increase from the report, capped by the quarantined value
export const getReleasableAmount = ({
  onchainPending,
  onchainTotalValue,
  simulatedTotalValue,
}: {
  onchainPending: bigint;
  onchainTotalValue: bigint;
  simulatedTotalValue: bigint;
}) =>
  minBigint(
    maxBigint(simulatedTotalValue - onchainTotalValue, 0n),
    onchainPending,
  );

export const getQuarantineBannerState = ({
  isReportFresh,
  isReportAvailable,
  hubReportTimestamp,
  onchain,
  simulated,
  simulatedTotalValue,
  frameDuration,
  now,
}: {
  isReportFresh: boolean;
  isReportAvailable: boolean;
  hubReportTimestamp: bigint;
  onchain?: OnchainQuarantine;
  simulated?: VaultQuarantineState;
  simulatedTotalValue?: bigint;
  frameDuration?: bigint;
  now: bigint;
}): QuarantineBannerState | null => {
  if (
    !isReportFresh &&
    isReportAvailable &&
    onchain?.quarantine.isActive &&
    simulatedTotalValue !== undefined &&
    hubReportTimestamp >= onchain.quarantine.endTimestamp
  ) {
    const { pendingTotalValueIncrease, totalValueRemainder } =
      onchain.quarantine;
    const releasable = getReleasableAmount({
      onchainPending: pendingTotalValueIncrease,
      onchainTotalValue: onchain.totalValue,
      simulatedTotalValue,
    });

    if (releasable > 0n) {
      return {
        type: 'releasable',
        total: pendingTotalValueIncrease + totalValueRemainder,
        releasable,
      };
    }
  }

  if (!simulated?.endTimestamp || !simulated.pendingTotalValueIncrease) {
    return null;
  }

  return {
    type: 'default',
    total: simulated.pendingTotalValueIncrease + simulated.totalValueRemainder,
    pending: simulated.pendingTotalValueIncrease,
    expectedReportTimestamp: frameDuration
      ? getExpectedReportTimestamp({
          hubReportTimestamp,
          endTimestamp: simulated.endTimestamp,
          frameDuration,
          now,
        })
      : undefined,
  };
};
