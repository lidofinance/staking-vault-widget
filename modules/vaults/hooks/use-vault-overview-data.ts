import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { Address } from 'viem';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  useVault,
  fetchVaultMetrics,
  fetch7dApr,
  VAULTS_CONNECT_DEPOSIT,
  type VaultApiMetrics,
  type VaultBaseInfo,
  type VaultConnection,
  type VaultRecord,
  type Vault7DApr,
  VAULT_TOTAL_BASIS_POINTS_BN,
  getStEthContract,
  VaultDisconnectedError,
} from 'modules/vaults';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import { ONE_ETHER } from 'consts/tx';
import {
  formatPercent,
  calculateHealth,
  formatToPercentWithDivider,
  toEthValue,
  getMintingConstraintType,
  formatBasisPoint,
  calculateOverviewV2,
} from 'utils';
import { bigIntClampZero, bigIntMax, bigIntMin } from 'utils/bigint-math';

import { baseRetry } from '../consts';

type VaultDataArgs = {
  vault: VaultBaseInfo;
};

type VaultDataCtx = {
  publicClient: RegisteredPublicClient;
  lidoSDKShares: LidoSDKShares;
};

type VaultRecordWithoutDelta = Omit<VaultRecord, 'inOutDelta'>;

export type VaultQuarantineState = {
  isActive: boolean;
  pendingTotalValueIncrease: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
  totalValueRemainder: bigint;
};

export type TotalMintingCapacityByDeltaValueFn = (deltaValue: bigint) => {
  totalMintingCapacitySteth: bigint;
  totalLockableValueEth: bigint;
};

export type VaultInfo = VaultConnection &
  VaultRecordWithoutDelta & {
    address: Address;
    owner: Address;
    nodeOperator: Address;
    totalValueETH: bigint;
    liabilityShares: bigint;
    liabilityStETH: bigint;
    currentLiabilityStETH: bigint;
    mintableStETH: bigint;
    mintableShares: bigint;
    stETHLimit: bigint;
    totalMintingCapacityShares: bigint;
    totalMintingCapacityStETH: bigint;
    inOutDelta: bigint;
    redemptionShares: bigint;
    redemptionStETH: bigint;
    lockedEth: bigint;
    nodeOperatorUnclaimedFee: bigint;
    withdrawableEther: bigint;
    balance: bigint;
    feeRate: number;
    withdrawalCredentials: Address;
    tierId: bigint;
    tierShareLimit: bigint;
    tierStETHLimit: bigint;
    operatorGridEffectiveStETHLimit: bigint;
    vaultQuarantineState: VaultQuarantineState;
    currentMaxLiabilityStETH: bigint;
    obligationsShortfallValue: bigint;
    stETHToBurnForObligations: bigint;
    feesToSettle: bigint;
    rebalanceShares: bigint;
    rebalanceStETH: bigint;
    lidoTVLSharesLimit: bigint;
    groupShareLimit: bigint;
    stagedBalanceWei: bigint;
    availableBalanceWei: bigint;
    isPendingDisconnect: boolean;
    isVaultDisconnected: boolean;
    isVaultConnected: boolean;
    beaconChainDepositsPaused: boolean;
    isReportFresh: boolean;
  };

export type VaultOverviewData = ReturnType<typeof selectOverviewData>;

const getVaultData = async (
  { vault }: VaultDataArgs,
  { publicClient, lidoSDKShares }: VaultDataCtx,
): Promise<VaultInfo> => {
  const {
    address,
    dashboard,
    vault: vaultContract,
    nodeOperator,
    withdrawalCredentials,
    forcedRebalanceThresholdBP,
    shareLimit,
    hub,
    operatorGrid,
    report,
    isReportFresh,
    lazyOracle,
    blockNumber,
    group,
    ...rest
  } = vault;

  const vaultAddress = vault.address;

  const [
    balance,
    totalValueETH,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    feeRate,
    totalMintingCapacityShares,
    mintableShares,
    tier,
    vaultQuarantineState,
    operatorGridEffectiveShareLimit,
  ] = await readWithReport({
    publicClient,
    lazyOracle,
    report,
    isReportFresh,
    contracts: [
      {
        abi: Multicall3AbiUtils,
        address: publicClient.chain.contracts.multicall3.address,
        functionName: 'getEthBalance',
        args: [address],
      },
      dashboard.prepare.totalValue(),
      dashboard.prepare.accruedFee(),
      dashboard.prepare.withdrawableValue(),
      dashboard.prepare.feeRate(),
      dashboard.prepare.totalMintingCapacityShares(),
      dashboard.prepare.remainingMintingCapacityShares([0n]),
      operatorGrid.prepare.vaultTierInfo([vaultAddress]),
      lazyOracle.prepare.vaultQuarantine([vaultAddress]),
      operatorGrid.prepare.effectiveShareLimit([vaultAddress]),
    ] as const,
    blockNumber,
  });

  // TODO: fix ts types deps and join in one call
  const [
    obligationsShortfallValue,
    [stethSharesToBurnForObligations, feesToSettle],
    rebalanceShares,
    vaultRecord,
    lockedEth,
    stagedBalanceWei,
    beaconChainDepositsPaused,
    availableBalanceWei,
  ] = await readWithReport({
    publicClient,
    lazyOracle,
    report,
    isReportFresh,
    contracts: [
      dashboard.prepare.obligationsShortfallValue(),
      dashboard.prepare.obligations(),
      hub.prepare.healthShortfallShares([vaultAddress]),
      hub.prepare.vaultRecord([vaultAddress]),
      dashboard.prepare.locked(),
      vaultContract.prepare.stagedBalance(),
      vaultContract.prepare.beaconChainDepositsPaused(),
      vaultContract.prepare.availableBalance(),
    ] as const,
    blockNumber,
  });

  const vaultRecordCurrent = isReportFresh
    ? vaultRecord
    : await hub.read.vaultRecord([vaultAddress]);
  const {
    liabilityShares: currentLiabilityShares,
    maxLiabilityShares: currentMaxLiabilityShares,
  } = vaultRecordCurrent;

  const {
    liabilityShares,
    inOutDelta: inOutDeltaArray,
    settledLidoFees,
    cumulativeLidoFees,
    redemptionShares,
    ...restVaultRecord
  } = vaultRecord;

  const inOutDelta = inOutDeltaArray[1].value;
  const [_, tierId, tierShareLimit] = tier;
  const { shareLimit: groupShareLimit } = group;

  const lidoV3Contract = getStEthContract(publicClient);

  const [
    liabilityStETH,
    currentLiabilityStETH,
    //
    mintableStETH,
    stETHLimit,
    totalMintingCapacityStETH,
    tierStETHLimit,
    //
    stETHToBurnForObligations,
    rebalanceStETH,
    redemptionStETH,
    currentMaxLiabilityStETH,
    //
    operatorGridEffectiveStETHLimit,
  ] = await lidoSDKShares.convertBatchSharesToSteth([
    { amount: liabilityShares, roundUp: true },
    { amount: currentLiabilityShares, roundUp: true },
    //
    mintableShares,
    shareLimit,
    totalMintingCapacityShares,
    tierShareLimit,
    //
    { amount: stethSharesToBurnForObligations, roundUp: true },
    { amount: rebalanceShares, roundUp: true },
    { amount: redemptionShares, roundUp: true },
    { amount: currentMaxLiabilityShares, roundUp: true },
    //
    { amount: operatorGridEffectiveShareLimit, roundUp: false },
  ]);

  const lidoTVLSharesLimit =
    await lidoV3Contract.read.getMaxMintableExternalShares();

  return {
    address,
    nodeOperator,
    totalValueETH,
    liabilityStETH,
    currentLiabilityStETH,
    mintableStETH,
    mintableShares,
    stETHLimit,
    totalMintingCapacityShares,
    totalMintingCapacityStETH,
    inOutDelta,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    availableBalanceWei,
    currentMaxLiabilityStETH,
    feeRate,
    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    withdrawalCredentials,
    settledLidoFees,
    cumulativeLidoFees,
    vaultQuarantineState,
    lockedEth,
    tierId,
    tierShareLimit,
    tierStETHLimit,
    lidoTVLSharesLimit,
    groupShareLimit,
    operatorGridEffectiveStETHLimit,
    stagedBalanceWei,
    obligationsShortfallValue,
    stETHToBurnForObligations,
    feesToSettle,
    rebalanceShares,
    rebalanceStETH,
    redemptionShares,
    redemptionStETH,
    beaconChainDepositsPaused,
    isReportFresh,
    ...rest,
    ...restVaultRecord,
  };
};

const selectOverviewData = ({
  vaultData,
  vaultMetrics,
  vault7dApr,
}: {
  vaultData: VaultInfo;
  vaultMetrics: VaultApiMetrics | null;
  vault7dApr: Vault7DApr | null;
}) => {
  const {
    address,
    reserveRatioBP,
    forcedRebalanceThresholdBP,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    totalValueETH,
    balance,
    feeRate: nodeOperatorFee,
    nodeOperator,
    isVaultDisconnected,
    isVaultConnected,
    settledLidoFees,
    cumulativeLidoFees,
    lockedEth,
    mintableStETH,
    tierId,
    tierStETHLimit,
    minimalReserve,
    currentMaxLiabilityStETH,
    beaconChainDepositsPauseIntent,
    vaultQuarantineState,
    disconnectInitiatedTs,
    isPendingDisconnect,
    totalMintingCapacityShares,
    shareLimit,
    tierShareLimit,
    groupShareLimit,
    lidoTVLSharesLimit,
    stagedBalanceWei,
    obligationsShortfallValue,
    stETHToBurnForObligations,
    feesToSettle,
    redemptionShares,
    redemptionStETH,
    rebalanceShares,
    rebalanceStETH,
    beaconChainDepositsPaused,
    isReportFresh,
    availableBalanceWei,
    operatorGridEffectiveStETHLimit,
  } = vaultData;

  const unsettledLidoFees = cumulativeLidoFees - settledLidoFees;
  const feeObligation = unsettledLidoFees + nodeOperatorUnclaimedFee;

  const overview = calculateOverviewV2({
    totalValue: totalValueETH,
    reserveRatioBP,
    liabilitySharesInStethWei: vaultData.liabilityStETH,
    currentLiabilityStETH: vaultData.currentLiabilityStETH,
    forceRebalanceThresholdBP: vaultData.forcedRebalanceThresholdBP,
    withdrawableEther,
    balance,
    locked: lockedEth,
    nodeOperatorDisbursableFee: nodeOperatorUnclaimedFee,
    totalMintingCapacityStethWei: vaultData.totalMintingCapacityStETH,
    unsettledLidoFees,
    currentMaxLiabilityStETH,
    feeObligation,
  });

  // Force rebalance
  // source https://github.com/lidofinance/core/blob/master/contracts/0.8.25/vaults/VaultHub.sol#L956
  const valueToForceRebalance = bigIntMin(
    // total value attributed to the vault by vault hub
    totalValueETH,
    // the unstaked value on vault balance
    availableBalanceWei,
    // if vault is unhealthy and can be force-rebalanced, dashboard.obligations() will include unhealthy part
    stETHToBurnForObligations,
  );

  const isForceRebalance = valueToForceRebalance > 0n;

  // Binding-constraint detection:
  // - totalMintingCapacityShares is the current effective capacity (RR-based and already
  //   reduced by any active caps).
  // - We compare it against raw caps (vault / tier / group / Lido) and pick the minimum to
  //   identify what actually constrains minting right now.
  // - In case of equality, we attribute the constraint to the specific cap (not RR), because
  //   ties resolve to the later entry in the list below.
  // Example: RR=100, vault=80, tier=90, group=85, Lido=120 => binding is 'vault'.
  const mintingConstraintBy = getMintingConstraintType({
    minimalReserve,
    collateral: lockedEth,
    totalMintingCapacityShares,
    vaultShareLimit: shareLimit,
    tierShareLimit,
    tierId,
    groupShareLimit,
    lidoTVLSharesLimit,
    totalValue: totalValueETH,
  });

  const { healthRatio } = calculateHealth({
    totalValue: totalValueETH,
    liabilitySharesInStethWei: vaultData.liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  const {
    rebaseReward,
    grossStakingRewards,
    nodeOperatorRewards,
    netStakingRewards,
    bottomLine,
  } = vaultMetrics || {};

  const netApr = formatToPercentWithDivider(vault7dApr?.netStakingApr.sma);

  const carrySpreadAprNumber = vault7dApr?.carrySpreadApr.sma;
  const carrySpreadApr = formatToPercentWithDivider(carrySpreadAprNumber);

  const reserveRatio = formatBasisPoint(reserveRatioBP);
  const rebalanceThreshold = formatBasisPoint(forcedRebalanceThresholdBP);
  const healthFactor = formatPercent.format(healthRatio / 100);
  const healthFactorNumber = healthRatio > 100000 ? Infinity : healthRatio;
  const utilizationRatio = formatPercent.format(
    overview.utilizationRatio / 100,
  );

  const feeRate = formatBasisPoint(Number(nodeOperatorFee));
  const pendingUnlock = overview.recentlyRepaid;
  const pendingUnlockEth = toEthValue(pendingUnlock > 0n ? pendingUnlock : 0n);

  // Sources:
  // VaultHub._totalMintingCapacityShares - https://github.com/lidofinance/core/blob/80ce4be7685f62fdda9058a0add2a7c3bfdfc31b/contracts/0.8.25/vaults/VaultHub.sol#L1513
  // Dashboard.totalMintingCapacityShares -  https://github.com/lidofinance/core/blob/80ce4be7685f62fdda9058a0add2a7c3bfdfc31b/contracts/0.8.25/vaults/dashboard/Dashboard.sol#L207
  const totalMintingCapacityStethByDeltaValue: TotalMintingCapacityByDeltaValueFn =
    (deltaValue: bigint) => {
      const maxLockableValue = bigIntClampZero(
        totalValueETH -
          nodeOperatorUnclaimedFee -
          unsettledLidoFees +
          deltaValue,
      );

      const reserveValue =
        (maxLockableValue * BigInt(reserveRatioBP)) /
        VAULT_TOTAL_BASIS_POINTS_BN;

      const capacitySteth = bigIntClampZero(
        maxLockableValue - bigIntMax(reserveValue, minimalReserve),
      );

      const totalMintingCapacitySteth = bigIntMin(
        // capacity based on current total value and reserve ratio
        capacitySteth,
        operatorGridEffectiveStETHLimit,
      );
      return {
        totalLockableValueEth: maxLockableValue,
        totalMintingCapacitySteth,
      };
    };

  return {
    ...vaultData,
    address,
    nodeOperator,
    reserveRatio,
    utilizationRatio,
    utilizationRatioNumber: overview.utilizationRatio,
    rebalanceThreshold,
    healthFactor,
    healthFactorNumber,
    withdrawableEther,

    balance,

    undisbursedNodeOperatorFee: nodeOperatorUnclaimedFee,
    feeRate,
    collateral: lockedEth,
    pendingUnlockEth,
    pendingUnlock,
    isVaultConnected,
    netApr,
    totalMintingCapacityStethByDeltaValue,

    unsettledLidoFees,

    feeObligation,
    tierId: tierId.toString(),

    mintableStETH,
    forcedRebalanceThresholdBP,
    reserveRatioBP,
    grossStakingRewards,
    nodeOperatorRewards,
    bottomLine,
    rebaseReward,
    vaultLiabilityStETH: vaultData.liabilityStETH,
    isPausedByFees: feesToSettle > ONE_ETHER,
    netStakingRewards,
    carrySpreadApr,
    carrySpreadAprNumber,
    vaultData,
    vaultMetrics,
    vaultQuarantineState,
    beaconChainDepositsPauseIntent,
    beaconChainDepositsPaused,
    tierStETHLimit,
    isPendingDisconnect,
    isVaultDisconnected,
    disconnectInitiatedTs,
    mintingConstraintBy,
    minimalReserve,
    stagedBalanceWei,
    obligationsShortfallValue,
    stETHToBurnForObligations,
    feesToSettle,
    redemptionShares,
    redemptionStETH,
    rebalanceShares,
    rebalanceStETH,
    availableBalanceWei,
    //
    isForceRebalance,
    valueToForceRebalance,
    // minimalReserve is connection deposit (1 ETH), but it can increase if slashing happened in tier
    isSlashingHappened: minimalReserve > VAULTS_CONNECT_DEPOSIT,
    supplyETH: overview.supply,
    repayStETH: overview.repay,
    outdatedReportData: vault7dApr?.outdated,
    dateOfLastReport: vault7dApr?.range.toTimestamp,
    isReportFresh,
  };
};

export const useVaultOverviewData = () => {
  const { publicClient, shares } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  const query = useQuery({
    queryKey: [...queryKeys.state, 'vault-overview-data'],
    enabled: !!activeVault,
    refetchOnMount: true,
    staleTime: 0,
    retry: baseRetry,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useVaultOverviewData] activeVault is not defined',
      );

      if (activeVault.isVaultDisconnected) {
        throw new VaultDisconnectedError();
      }

      const [vaultData, vaultMetrics, vault7dApr] = await Promise.all([
        getVaultData(
          { vault: activeVault },
          { publicClient, lidoSDKShares: shares },
        ),
        fetchVaultMetrics({ vaultAddress: activeVault.address }).catch(
          (error) => {
            console.warn(
              '[useVaultOverviewData] Failed to fetch vault metrics from API',
              error,
            );
            return null;
          },
        ),
        fetch7dApr({ vaultAddress: activeVault.address }).catch((error) => {
          console.warn(
            '[useVaultOverviewData] Failed to fetch vault 7 days APR',
            error,
          );
          return null;
        }),
      ]);
      return { vaultData, vaultMetrics, vault7dApr };
    },
    select: selectOverviewData,
  });

  return { ...query };
};
