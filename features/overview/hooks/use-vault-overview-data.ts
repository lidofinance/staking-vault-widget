import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { Address } from 'viem';

import { calculateHealth } from 'utils';
import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  useVault,
  fetchVaultMetrics,
  VAULT_TOTAL_BASIS_POINTS,
  getLidoContract,
  getStEthContract,
  type VaultApiMetrics,
  type VaultBaseInfo,
  type VaultConnection,
  type VaultRecord,
} from 'modules/vaults';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import {
  formatPercent,
  toEthValue,
  toStethValue,
  getMintingConstraintType,
  type MintingConstraintType,
} from 'utils';

import { calculateOverviewV2 } from 'features/overview/consts';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
};

type VaultRecordWithoutDelta = Omit<VaultRecord, 'inOutDelta'>;

type VaultQuarantineState = {
  isActive: boolean;
  pendingTotalValueIncrease: bigint;
  startTimestamp: bigint;
  endTimestamp: bigint;
  totalValueRemainder: bigint;
};

export type VaultInfo = VaultConnection &
  VaultRecordWithoutDelta & {
    isVaultConnected: boolean;
    address: Address;
    owner: Address;
    nodeOperator: Address;
    totalValue: bigint;
    liabilityShares: bigint;
    liabilityStETH: bigint;
    mintableStETH: bigint;
    mintableShares: bigint;
    stETHLimit: bigint;
    healthScore: number;
    mintingConstraintBy: MintingConstraintType;
    totalMintingCapacityShares: bigint;
    totalMintingCapacityStETH: bigint;
    inOutDelta: bigint;
    redemptionShares: bigint;
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
  };

export type VaultOverviewData = ReturnType<typeof selectOverviewData>;

const getVaultData = async ({
  publicClient,
  vault,
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

  const [vaultRecord, isVaultConnected, locked] = await Promise.all([
    hub.read.vaultRecord([vault.address]),
    hub.read.isVaultConnected([vault.address]),
    hub.read.locked([vault.address]),
  ]);

  const {
    liabilityShares,
    inOutDelta: inOutDeltaArray,
    settledLidoFees,
    cumulativeLidoFees,
    ...restVaultRecord
  } = vaultRecord;

  const inOutDelta = inOutDeltaArray[1].value;
  const [_, tierId, tierShareLimit] = tier;
  const { shareLimit: groupShareLimit } = group;

  const lidoV3Contract = getLidoContract(publicClient);
  const stethContract = getStEthContract(publicClient);

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    lockedShares,
    totalMintingCapacityStETH,
    tierStETHLimit,
    lidoTVLSharesLimit,
  ] = await Promise.all([
    stethContract.read.getPooledEthBySharesRoundUp([liabilityShares]),
    stethContract.read.getPooledEthByShares([mintableShares]),
    stethContract.read.getPooledEthByShares([shareLimit]),
    stethContract.read.getPooledEthByShares([locked]),
    stethContract.read.getPooledEthByShares([totalMintingCapacityShares]),
    stethContract.read.getPooledEthByShares([tierShareLimit]),
    lidoV3Contract.read.getMaxMintableExternalShares(),
  ]);

  const reportLiabilitySharesStETH = report
    ? await stethContract.read.getPooledEthBySharesRoundUp([
        report.liabilityShares,
      ])
    : 0n;

  // Binding-constraint detection:
  // - totalMintingCapacityShares is the current effective capacity (RR-based and already
  //   reduced by any active caps).
  // - We compare it against raw caps (vault / tier / group / Lido) and pick the minimum to
  //   identify what actually constrains minting right now.
  // - In case of equality, we attribute the constraint to the specific cap (not RR), because
  //   ties resolve to the later entry in the list below.
  // Example: RR=100, vault=80, tier=90, group=85, Lido=120 => binding is 'vault'.
  const mintingConstraintBy = getMintingConstraintType({
    totalMintingCapacityShares,
    vaultShareLimit: shareLimit,
    tierShareLimit,
    tierId,
    groupShareLimit,
    lidoTVLSharesLimit,
  });

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    isVaultConnected,
    address,
    nodeOperator,
    totalValue,
    liabilityStETH,
    mintableStETH,
    mintableShares,
    stETHLimit,
    mintingConstraintBy,
    healthScore: healthScore.healthRatio,
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
    ...rest,
    ...restVaultRecord,
  };
};

const selectOverviewData = ({
  vaultData,
  vaultMetrics,
}: {
  vaultData: VaultInfo;
  vaultMetrics: VaultApiMetrics | null;
}) => {
  const {
    address,
    healthScore,
    reserveRatioBP,
    forcedRebalanceThresholdBP,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    feeRate: nodeOperatorFee,
    nodeOperator,
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

  const {
    rebaseReward,
    grossStakingRewards,
    nodeOperatorRewards,
    netStakingRewards,
    bottomLine,
  } = vaultMetrics || {};

  const netApr =
    (vaultMetrics &&
      formatPercent.format(vaultMetrics.netStakingAprPercent / 100)) ??
    undefined;
  const carrySpreadApr =
    (vaultMetrics &&
      formatPercent.format(vaultMetrics.carrySpreadAprPercent / 100)) ??
    undefined;

  const tierLimitStETH = toStethValue(tierStETHLimit);
  const remainingMintingCapacityStETH = toStethValue(mintableStETH);
  const undisbursedNodeOperatorFeeEth = toEthValue(nodeOperatorUnclaimedFee);
  const unsettledLidoFeesEth = toEthValue(unsettledLidoFees);

  const feeObligationEth = toEthValue(
    unsettledLidoFees + nodeOperatorUnclaimedFee,
  );
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
  const healthFactor = formatPercent.format(healthScore / 100);
  const healthFactorNumber = healthScore > 100000 ? Infinity : healthScore;
  const utilizationRatio = formatPercent.format(
    overview.utilizationRatio / 100,
  );

  const totalMintingCapacityStETH = toStethValue(
    vaultData.totalMintingCapacityStETH,
  );
  const feeRate = formatPercent.format(
    Number(nodeOperatorFee) / VAULT_TOTAL_BASIS_POINTS,
  );
  const collateral = toEthValue(overview.collateral);
  const pendingUnlock = overview.recentlyRepaid;
  const pendingUnlockEth = toEthValue(pendingUnlock > 0n ? pendingUnlock : 0n);

  return {
    address,
    nodeOperator,
    totalValueETH,
    reserveRatio,
    utilizationRatio,
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
    collateral,
    pendingUnlockEth,
    isVaultConnected,
    netApr,
    unsettledLidoFeesEth,
    unsettledLidoFees,
    remainingMintingCapacityStETH,
    feeObligationEth,
    tierId: tierId.toString(),
    tierLimitStETH,
    mintableStETH,
    forcedRebalanceThresholdBP,
    reserveRatioBP,
    totalMintingCapacity: vaultData.totalMintingCapacityStETH,
    totalValue: vaultData.totalValue,
    vaultLiability: vaultData.liabilityStETH,
    rebaseRewardEth: toStethValue(rebaseReward),
    grossStakingRewardsEth: toEthValue(grossStakingRewards),
    nodeOperatorRewardsEth: toEthValue(nodeOperatorRewards),
    netStakingRewardsEth: toEthValue(netStakingRewards),
    bottomLineEth: toEthValue(bottomLine),
    netStakingRewards,
    carrySpreadApr,
    vaultData,
    vaultMetrics,
    vaultQuarantineState,
    beaconChainDepositsPauseIntent,
  };
};

export const useVaultOverviewData = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-overview-data'],
    enabled: !!activeVault,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: async () => {
      invariant(activeVault, '[useSingleVaultData] activeVault is not defined');

      const [vaultData, vaultMetrics] = await Promise.all([
        getVaultData({ publicClient, vault: activeVault }),
        fetchVaultMetrics(
          { publicClient },
          { vaultAddress: activeVault.address },
        ).catch((error) => {
          console.warn(
            '[useVaultOverviewData] Failed to fetch vault metrics from API',
            error,
          );
          return null;
        }),
      ]);
      return { vaultData, vaultMetrics };
    },
    select: selectOverviewData,
  });
};
