import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

import { calculateHealth } from './calculate-health';
import { bigIntMax, bigIntMin } from './bigint-math';
import { ceilDivBigint } from './ceil-div-bigint';

export type OverviewArgs = {
  totalValue: bigint;
  reserveRatioBP: number;
  liabilitySharesInStethWei: bigint;
  currentLiabilityStETH: bigint;
  forceRebalanceThresholdBP: number;
  withdrawableEther: bigint;
  balance: bigint;
  locked: bigint;
  nodeOperatorDisbursableFee: bigint;
  totalMintingCapacityStethWei: bigint;
  unsettledLidoFees: bigint;
  feeObligation: bigint;
  currentMaxLiabilityStETH: bigint;
};

export const calculateOverviewV2 = (args: OverviewArgs) => {
  const {
    totalValue,
    reserveRatioBP,
    liabilitySharesInStethWei,
    currentLiabilityStETH,
    forceRebalanceThresholdBP,
    withdrawableEther,
    balance,
    locked,
    nodeOperatorDisbursableFee,
    totalMintingCapacityStethWei,
    unsettledLidoFees,
    feeObligation,
    currentMaxLiabilityStETH,
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
  const recentlyRepaid = bigIntMax(
    0n,
    currentMaxLiabilityStETH - currentLiabilityStETH,
  );

  const reservedByFormula =
    oneMinusRR === 0n
      ? 0n
      : ceilDivBigint(
          liabilitySharesInStethWei * VAULT_TOTAL_BASIS_POINTS_BN,
          oneMinusRR,
        ) - liabilitySharesInStethWei;

  // Prevent underflow
  const valueMinusLiability =
    totalValue > liabilitySharesInStethWei
      ? totalValue - liabilitySharesInStethWei
      : 0n;
  const reserved = bigIntMin(valueMinusLiability, reservedByFormula);

  // Prevent division by 0
  const utilizationRatio =
    totalMintingCapacityStethWei === 0n
      ? 0
      : Number(
          ((liabilitySharesInStethWei * VAULT_TOTAL_BASIS_POINTS_BN) /
            totalMintingCapacityStethWei) *
            100n,
        ) / Number(VAULT_TOTAL_BASIS_POINTS_BN);

  // Prevent underflow
  const effectiveTotalValue =
    totalValue > feeObligation ? totalValue - feeObligation : 0n;

  // repay-obligations
  const repay = bigIntMax(
    0n,
    liabilitySharesInStethWei -
      (effectiveTotalValue * oneMinusRR) / VAULT_TOTAL_BASIS_POINTS_BN,
  );

  const supply =
    oneMinusRR === 0n
      ? 0n
      : bigIntMax(0n, (repay * VAULT_TOTAL_BASIS_POINTS_BN) / oneMinusRR);

  return {
    healthRatio,
    isHealthy,
    availableToWithdrawal,
    idleCapital,
    totalLocked,
    recentlyRepaid,
    utilizationRatio,
    reserved,
    totalMintingCapacityStethWei,
    supply,
    repay,
  };
};
