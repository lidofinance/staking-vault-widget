import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { calculateHealth, formatToPercentWithDivider } from 'utils';
import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  useVault,
  fetchVaultMetrics,
  fetch7dApr,
  getLidoContract,
  VAULTS_CONNECT_DEPOSIT,
  type VaultApiMetrics,
  type VaultBaseInfo,
  type VaultConnection,
  type VaultRecord,
  type Vault7DApr,
} from 'modules/vaults';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import { WEI_PER_ETHER } from 'consts/tx';
import {
  formatPercent,
  toEthValue,
  toStethValue,
  getMintingConstraintType,
  formatBasisPoint,
} from 'utils';

import { calculateOverviewV2 } from 'features/overview/consts';
import { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk';

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

export type VaultInfo = VaultConnection &
  VaultRecordWithoutDelta & {
    address: Address;
    owner: Address;
    nodeOperator: Address;
    totalValue: bigint;
    liabilityShares: bigint;
    liabilityStETH: bigint;
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
    vaultQuarantineState: VaultQuarantineState;
    reportLiabilitySharesStETH: bigint;
    obligationsShortfallValue: bigint;
    stETHToBurn: bigint;
    feesToSettle: bigint;
    rebalanceShares: bigint;
    rebalanceStETH: bigint;
    lidoTVLSharesLimit: bigint;
    groupShareLimit: bigint;
    stagedBalanceWei: bigint;
    isPendingDisconnect: boolean;
    isVaultDisconnected: boolean;
    isVaultConnected: boolean;
    beaconChainDepositsPaused: boolean;
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
    reportLiabilityShares,
    lazyOracle,
    blockNumber,
    ...rest
  } = vault;

  const [
    balance,
    totalValue,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    feeRate,
    totalMintingCapacityShares,
    mintableShares,
    tier,
    group,
    vaultQuarantineState,
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
      operatorGrid.prepare.vaultTierInfo([vault.address]),
      operatorGrid.prepare.group([vault.nodeOperator]),
      lazyOracle.prepare.vaultQuarantine([vault.address]),
    ] as const,
    blockNumber,
  });

  // TODO: fix ts types deps and join in one call
  const [
    obligationsShortfallValue,
    [sharesToBurn, feesToSettle],
    rebalanceShares,
    vaultRecord,
    lockedEth,
    stagedBalanceWei,
    beaconChainDepositsPaused,
  ] = await readWithReport({
    publicClient,
    lazyOracle,
    report,
    isReportFresh,
    contracts: [
      dashboard.prepare.obligationsShortfallValue(),
      dashboard.prepare.obligations(),
      hub.prepare.healthShortfallShares([vault.address]),
      hub.prepare.vaultRecord([vault.address]),
      hub.prepare.locked([vault.address]),
      vaultContract.prepare.stagedBalance(),
      vaultContract.prepare.beaconChainDepositsPaused(),
    ] as const,
    blockNumber,
  });

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

  const lidoV3Contract = getLidoContract(publicClient);

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    totalMintingCapacityStETH,
    tierStETHLimit,
    stETHToBurn,
    rebalanceStETH,
    redemptionStETH,
    reportLiabilitySharesStETH,
  ] = await lidoSDKShares.convertBatchSharesToSteth([
    { amount: liabilityShares, roundUp: true },
    mintableShares,
    shareLimit,
    totalMintingCapacityShares,
    tierShareLimit,
    { amount: sharesToBurn, roundUp: true },
    { amount: rebalanceShares, roundUp: true },
    { amount: redemptionShares, roundUp: true },
    { amount: reportLiabilityShares, roundUp: true },
  ]);

  const lidoTVLSharesLimit =
    await lidoV3Contract.read.getMaxMintableExternalShares();

  return {
    address,
    nodeOperator,
    totalValue,
    liabilityStETH,
    mintableStETH,
    mintableShares,
    stETHLimit,
    totalMintingCapacityShares,
    totalMintingCapacityStETH,
    inOutDelta,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    reportLiabilitySharesStETH,
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
    stagedBalanceWei,
    obligationsShortfallValue,
    stETHToBurn,
    feesToSettle,
    rebalanceShares,
    rebalanceStETH,
    redemptionShares,
    redemptionStETH,
    beaconChainDepositsPaused,
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
    reportLiabilitySharesStETH,
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
    stETHToBurn,
    feesToSettle,
    redemptionShares,
    redemptionStETH,
    rebalanceShares,
    rebalanceStETH,
    beaconChainDepositsPaused,
  } = vaultData;

  const unsettledLidoFees = cumulativeLidoFees - settledLidoFees;
  const feeObligation = unsettledLidoFees + nodeOperatorUnclaimedFee;

  const overview = calculateOverviewV2({
    totalValue: vaultData.totalValue,
    reserveRatioBP,
    liabilitySharesInStethWei: vaultData.liabilityStETH,
    forceRebalanceThresholdBP: vaultData.forcedRebalanceThresholdBP,
    withdrawableEther,
    balance,
    locked: lockedEth,
    nodeOperatorDisbursableFee: nodeOperatorUnclaimedFee,
    totalMintingCapacityStethWei: vaultData.totalMintingCapacityStETH,
    unsettledLidoFees,
    minimalReserve,
    reportLiabilitySharesStETH,
    feeObligation,
  });

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
    collateral: overview.collateral,
    totalMintingCapacityShares,
    vaultShareLimit: shareLimit,
    tierShareLimit,
    tierId,
    groupShareLimit,
    lidoTVLSharesLimit,
  });

  const { healthRatio } = calculateHealth({
    totalValue: vaultData.totalValue,
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

  const tierLimitStETH = toStethValue(tierStETHLimit);
  const remainingMintingCapacityStETH = toStethValue(mintableStETH);
  const undisbursedNodeOperatorFeeEth = toEthValue(nodeOperatorUnclaimedFee);
  const unsettledLidoFeesEth = toEthValue(unsettledLidoFees);

  const feeObligationEth = toEthValue(feeObligation);
  const totalValueETH = toEthValue(vaultData.totalValue);
  const totalLocked = toEthValue(lockedEth + nodeOperatorUnclaimedFee);
  const liabilityStETH = toStethValue(vaultData.liabilityStETH);
  const withdrawableEth = toEthValue(withdrawableEther);
  const balanceEth = toEthValue(balance);
  const reserveRatio = formatBasisPoint(reserveRatioBP);
  const rebalanceThreshold = formatBasisPoint(forcedRebalanceThresholdBP);
  const healthFactor = formatPercent.format(healthRatio / 100);
  const healthFactorNumber = healthRatio > 100000 ? Infinity : healthRatio;
  const utilizationRatio = formatPercent.format(
    overview.utilizationRatio / 100,
  );

  const totalMintingCapacityStETH = toStethValue(
    vaultData.totalMintingCapacityStETH,
  );
  const feeRate = formatBasisPoint(Number(nodeOperatorFee));
  const pendingUnlock = overview.recentlyRepaid;
  const pendingUnlockEth = toEthValue(pendingUnlock > 0n ? pendingUnlock : 0n);

  return {
    address,
    nodeOperator,
    totalValueETH,
    reserveRatio,
    utilizationRatio,
    utilizationRatioNumber: overview.utilizationRatio,
    rebalanceThreshold,
    healthFactor,
    healthFactorNumber,
    totalLocked,
    liabilityStETH,
    totalMintingCapacityStETH,
    withdrawableEth,
    withdrawableEther,
    balanceEth,
    balance,
    undisbursedNodeOperatorFeeEth,
    undisbursedNodeOperatorFee: nodeOperatorUnclaimedFee,
    feeRate,
    collateral: overview.collateral,
    pendingUnlockEth,
    pendingUnlock,
    isVaultConnected,
    netApr,
    unsettledLidoFeesEth,
    unsettledLidoFees,
    remainingMintingCapacityStETH,
    feeObligationEth,
    feeObligation,
    tierId: tierId.toString(),
    tierLimitStETH,
    mintableStETH,
    forcedRebalanceThresholdBP,
    reserveRatioBP,
    grossStakingRewards,
    nodeOperatorRewards,
    bottomLine,
    rebaseReward,
    infraFee: formatBasisPoint(vaultData.infraFeeBP),
    liquidityFee: formatBasisPoint(vaultData.liquidityFeeBP),
    reservationFee: formatBasisPoint(vaultData.reservationFeeBP),
    totalMintingCapacity: vaultData.totalMintingCapacityStETH,
    totalValue: vaultData.totalValue,
    vaultLiability: vaultData.liabilityStETH,
    rebaseRewardEth: toStethValue(rebaseReward),
    grossStakingRewardsEth: toEthValue(grossStakingRewards),
    nodeOperatorRewardsEth: toEthValue(nodeOperatorRewards),
    netStakingRewardsEth: toEthValue(netStakingRewards),
    bottomLineEth: toEthValue(bottomLine),
    isPausedByFees: feesToSettle > WEI_PER_ETHER,
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
    stETHToBurn,
    feesToSettle,
    redemptionShares,
    redemptionStETH,
    rebalanceShares,
    rebalanceStETH,
    // minimalReserve is connection deposit (1 ETH), but it can increase if slashing happened in tier
    isSlashingHappened: minimalReserve > VAULTS_CONNECT_DEPOSIT,
    supplyETH: overview.supply,
    repayStETH: overview.repay,
  };
};

export const useVaultOverviewData = () => {
  const { publicClient, shares } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  const query = useQuery({
    queryKey: [
      ...queryKeys.state,
      'vault-overview-data',
      activeVault?.blockNumber.toString(),
    ],
    enabled: !!activeVault,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useVaultOverviewData] activeVault is not defined',
      );

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
