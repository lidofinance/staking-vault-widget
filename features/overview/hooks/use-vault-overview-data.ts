import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { Address } from 'viem';

import { calculateHealth } from 'utils';
import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  useVault,
  fetchVaultMetrics,
  fetch7dApr,
  VAULT_TOTAL_BASIS_POINTS,
  getLidoV3Contract,
  type VaultApiMetrics,
  type VaultBaseInfo,
  type VaultConnection,
  type VaultRecord,
  type Vault7DApr,
} from 'modules/vaults';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import {
  formatPercent,
  toEthValue,
  toStethValue,
  getMintingConstraintType,
} from 'utils';

import { calculateOverviewV2 } from 'features/overview/consts';
import { WEI_PER_ETHER } from '../../../consts/tx';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
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
    lockedShares: bigint;
    locked: bigint;
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
    lidoTVLSharesLimit: bigint;
    groupShareLimit: bigint;
    stagedBalanceWei: bigint;
    obligationsShortfallValue: bigint;
    stETHToBurn: bigint;
    feesToSettle: bigint;
    rebalanceShares: bigint;
    rebalanceStETH: bigint;
    isPendingDisconnect: boolean;
    isVaultDisconnected: boolean;
    isVaultConnected: boolean;
  };

export type VaultOverviewData = ReturnType<typeof selectOverviewData>;

const getVaultData = async ({
  publicClient,
  vault,
  shares,
}: VaultDataArgs): Promise<VaultInfo> => {
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
    lazyOracle,
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
    report,
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
  });

  const [
    obligationsShortfallValue,
    [sharesToBurn, feesToSettle],
    rebalanceShares,
  ] = await readWithReport({
    publicClient,
    report,
    contracts: [
      dashboard.prepare.obligationsShortfallValue(),
      dashboard.prepare.obligations(),
      hub.prepare.healthShortfallShares([vault.address]),
    ] as const,
  });

  const [vaultRecord, locked, stagedBalanceWei] = await Promise.all([
    hub.read.vaultRecord([vault.address]),
    hub.read.locked([vault.address]),
    vaultContract.read.stagedBalance(),
  ]);

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

  const lidoV3Contract = getLidoV3Contract(publicClient);

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    lockedShares,
    totalMintingCapacityStETH,
    tierStETHLimit,
    stETHToBurn,
    rebalanceStETH,
    redemptionStETH,
    lidoTVLSharesLimit,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToShares(locked),
    shares.convertToSteth(totalMintingCapacityShares),
    shares.convertToSteth(tierShareLimit),
    // TODO: round with RoundUP
    shares.convertToSteth(sharesToBurn),
    shares.convertToSteth(rebalanceShares),
    shares.convertToSteth(redemptionShares),
    lidoV3Contract.read.getMaxMintableExternalShares(),
  ]);

  const reportLiabilitySharesStETH = report
    ? await shares.convertToSteth(report.liabilityShares)
    : 0n;

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
    lockedShares,
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
    locked,
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
    locked,
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
  } = vaultData;

  const unsettledLidoFees = cumulativeLidoFees - settledLidoFees;

  const overview = calculateOverviewV2({
    totalValue: vaultData.totalValue,
    reserveRatioBP,
    liabilitySharesInStethWei: vaultData.liabilityStETH,
    forceRebalanceThresholdBP: vaultData.forcedRebalanceThresholdBP,
    withdrawableEther,
    balance,
    locked,
    nodeOperatorDisbursableFee: nodeOperatorUnclaimedFee,
    totalMintingCapacityStethWei: vaultData.totalMintingCapacityStETH,
    unsettledLidoFees,
    minimalReserve,
    reportLiabilitySharesStETH,
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

  const netApr =
    (vault7dApr && formatPercent.format(vault7dApr.netStakingApr.sma / 100)) ??
    undefined;

  const carrySpreadApr =
    (vaultMetrics &&
      formatPercent.format(vaultMetrics.carrySpreadAprPercent / 100)) ??
    undefined;

  const tierLimitStETH = toStethValue(tierStETHLimit);
  const remainingMintingCapacityStETH = toStethValue(mintableStETH);
  const undisbursedNodeOperatorFeeEth = toEthValue(nodeOperatorUnclaimedFee);
  const unsettledLidoFeesEth = toEthValue(unsettledLidoFees);

  const feeObligation = unsettledLidoFees + nodeOperatorUnclaimedFee;
  const feeObligationEth = toEthValue(feeObligation);
  const totalValueETH = toEthValue(vaultData.totalValue);
  const totalLocked = toEthValue(locked + nodeOperatorUnclaimedFee);
  const liabilityStETH = toStethValue(vaultData.liabilityStETH);
  const withdrawableEth = toEthValue(withdrawableEther);
  const balanceEth = toEthValue(balance);
  const reserveRatio = formatPercent.format(
    reserveRatioBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const rebalanceThreshold = formatPercent.format(
    forcedRebalanceThresholdBP / VAULT_TOTAL_BASIS_POINTS,
  );
  const healthFactor = formatPercent.format(healthRatio / 100);
  const healthFactorNumber = healthRatio > 100000 ? Infinity : healthRatio;
  const utilizationRatio = formatPercent.format(
    overview.utilizationRatio / 100,
  );

  const totalMintingCapacityStETH = toStethValue(
    vaultData.totalMintingCapacityStETH,
  );
  const feeRate = formatPercent.format(
    Number(nodeOperatorFee) / VAULT_TOTAL_BASIS_POINTS,
  );
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
    vaultData,
    vaultMetrics,
    vaultQuarantineState,
    beaconChainDepositsPauseIntent,
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
  };
};

export const useVaultOverviewData = () => {
  const { shares, publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-overview-data'],
    enabled: !!activeVault,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      invariant(activeVault, '[useSingleVaultData] activeVault is not defined');

      const [vaultData, vaultMetrics, vault7dApr] = await Promise.all([
        getVaultData({ publicClient, shares, vault: activeVault }),
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
};
