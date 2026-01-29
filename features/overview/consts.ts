import { calculateHealth, ceilDivBigint } from 'utils';
import { bigIntMax, bigIntMin } from 'utils/bigint-math';
import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

export const UTILIZATION_RATIO_THRESHOLD = 100.01;

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

export const formatCustomDate = (ts: number): string => {
  const ms = Math.abs(ts) < 1e11 ? ts * 1000 : ts;
  return customDateFormatter.format(new Date(ms));
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
  minimalReserve: bigint;
  reportLiabilitySharesStETH: bigint;
};

export const calculateOverviewV2 = (args: OverviewArgs) => {
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
    minimalReserve,
    reportLiabilitySharesStETH,
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
  const oneMinusRR = VAULT_TOTAL_BASIS_POINTS_BN - RR;
  const collateral = bigIntMax(
    minimalReserve,
    ceilDivBigint(
      liabilitySharesInStethWei * VAULT_TOTAL_BASIS_POINTS_BN,
      oneMinusRR,
    ),
  );
  const recentlyRepaid = bigIntMax(
    0n,
    reportLiabilitySharesStETH - liabilitySharesInStethWei,
  );

  const reservedByFormula =
    oneMinusRR === 0n
      ? 0n
      : ceilDivBigint(
          liabilitySharesInStethWei * VAULT_TOTAL_BASIS_POINTS_BN,
          oneMinusRR,
        ) - liabilitySharesInStethWei;
  const reserved = bigIntMin(
    totalValue - liabilitySharesInStethWei,
    reservedByFormula,
  );

  // Prevent division by 0
  const utilizationRatio =
    totalMintingCapacityStethWei === 0n
      ? 0
      : Number(
          ((liabilitySharesInStethWei * VAULT_TOTAL_BASIS_POINTS_BN) /
            totalMintingCapacityStethWei) *
            100n,
        ) / Number(VAULT_TOTAL_BASIS_POINTS_BN);

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
