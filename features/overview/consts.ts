import { parseEther } from 'viem';

import { calculateHealth } from 'utils';
import { bigIntMax, bigIntMin } from 'utils/bigint-math';

export const modals = [
  'totalValue',
  'healthFactorNumber',
  'netApr',
  'balance',
  'withdrawableEther',
  'undisbursedNodeOperatorFee',
  'unsettledLidoFees',
  'vaultLiability',
] as const;

const customDateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: false,
  timeZoneName: 'shortOffset',
});

export const formatCustomDate = (timestampSeconds: number): string => {
  return customDateFormatter.format(new Date(timestampSeconds * 1000));
};

type OverviewArgs = {
  totalValue: bigint;
  reserveRatioBP: number;
  liabilitySharesInStethWei: bigint;
  forceRebalanceThresholdBP: number;
  withdrawableEther: bigint;
  balance: bigint;
  locked: bigint;
  nodeOperatorDisbursableFee: bigint;
  totalMintingCapacityStethWei: bigint;
  unsettledLidoFees: bigint;
};

const ceilDiv = (numerator: bigint, denominator: bigint): bigint => {
  const result = numerator / denominator;
  return numerator % denominator === 0n ? result : result + 1n;
};

export const calculateOverviewV2 = (args: OverviewArgs) => {
  const BASIS_POINTS = 10_000n;
  const {
    totalValue,
    reserveRatioBP,
    liabilitySharesInStethWei,
    forceRebalanceThresholdBP,
    withdrawableEther,
    balance,
    locked,
    nodeOperatorDisbursableFee,
    totalMintingCapacityStethWei,
    unsettledLidoFees,
  } = args;

  const { healthRatio, isHealthy } = calculateHealth({
    totalValue,
    liabilitySharesInStethWei,
    forceRebalanceThresholdBP,
  });
  const availableToWithdrawal = withdrawableEther;
  const idleCapital = balance;
  const totalLocked = locked + nodeOperatorDisbursableFee + unsettledLidoFees;
  const RR = BigInt(reserveRatioBP);
  const oneMinusRR = BASIS_POINTS - RR;
  const liabilityDivOneMinusRR =
    oneMinusRR === 0n
      ? 0n
      : ceilDiv(liabilitySharesInStethWei * BASIS_POINTS, oneMinusRR);

  const collateral = bigIntMax(parseEther('1'), liabilityDivOneMinusRR);
  const recentlyRepaid =
    liabilityDivOneMinusRR <= parseEther('1')
      ? bigIntMax(locked - parseEther('1'), 0n)
      : bigIntMax(locked - liabilityDivOneMinusRR, 0n);

  const reservedByFormula =
    oneMinusRR === 0n
      ? 0n
      : ceilDiv(liabilitySharesInStethWei * BASIS_POINTS, oneMinusRR) -
        liabilitySharesInStethWei;
  const reserved = bigIntMin(
    totalValue - liabilitySharesInStethWei,
    reservedByFormula,
  );

  // Prevent division by 0
  const utilizationRatio =
    totalMintingCapacityStethWei === 0n
      ? 0
      : Number(
          ((liabilitySharesInStethWei * BASIS_POINTS) /
            totalMintingCapacityStethWei) *
            100n,
        ) / Number(BASIS_POINTS);

  return {
    healthRatio,
    isHealthy,
    availableToWithdrawal,
    idleCapital,
    totalLocked,
    collateral,
    recentlyRepaid,
    utilizationRatio,
    reserved,
    totalMintingCapacityStethWei,
  };
};
