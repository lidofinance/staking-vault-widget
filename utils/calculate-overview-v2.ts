import {
  VAULT_TOTAL_BASIS_POINTS_BN,
  VAULT_TOTAL_BASIS_POINTS,
} from 'modules/vaults';

import { calculateHealth } from './calculate-health';
import { bigIntClampZero, bigIntMax, bigIntMin } from './bigint-math';
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

  const valueMinusLiability = bigIntClampZero(
    totalValue - liabilitySharesInStethWei,
  );

  const reserved = bigIntMin(valueMinusLiability, reservedByFormula);

  // Prevent division by 0
  const utilizationRatio =
    totalMintingCapacityStethWei === 0n
      ? 0
      : Number(
          (liabilitySharesInStethWei * VAULT_TOTAL_BASIS_POINTS_BN * 100n) /
            totalMintingCapacityStethWei,
        ) / VAULT_TOTAL_BASIS_POINTS;

  const effectiveTotalValue = bigIntClampZero(totalValue - feeObligation);

  // repay-obligations
  const repay = bigIntClampZero(
    liabilitySharesInStethWei -
      (effectiveTotalValue * oneMinusRR) / VAULT_TOTAL_BASIS_POINTS_BN,
  );

  const supply =
    oneMinusRR === 0n ? 0n : (repay * VAULT_TOTAL_BASIS_POINTS_BN) / oneMinusRR;

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
