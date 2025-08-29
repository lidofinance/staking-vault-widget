import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';
import { calculateOverviewV2 } from '@lidofinance/lsv-cli/dist/utils/calculate-overview-v2';

import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { Address } from 'viem';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import {
  readWithReport,
  useVault,
  fetchVaultMetrics,
  VAULT_TOTAL_BASIS_POINTS,
  getLidoV3Contract,
  type VaultApiMetrics,
  type VaultBaseInfo,
  type VaultConnection,
  type VaultObligations,
} from 'modules/vaults';

import { Multicall3AbiUtils } from 'abi/multicall-abi';
import {
  formatPercent,
  toEthValue,
  toStethValue,
  getMintingConstraintType,
  type MintingConstraintType,
} from 'utils';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vault: VaultBaseInfo;
  shares: LidoSDKShares;
};

export type VaultInfo = VaultConnection &
  VaultObligations & {
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
    locked: bigint;
    lockedShares: bigint;
    nodeOperatorUnclaimedFee: bigint;
    withdrawableEther: bigint;
    balance: bigint;
    nodeOperatorFeeRate: bigint;
    withdrawalCredentials: Address;
    tierId: bigint;
    tierShareLimit: bigint;
    tierStETHLimit: bigint;
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
    ...rest
  } = vault;

  const [
    record,
    isVaultConnected,
    obligations,
    balance,
    totalValue,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    nodeOperatorFeeRate,
    totalMintingCapacityShares,
    mintableShares,
    tier,
    group,
  ] = await readWithReport({
    publicClient,
    report: vault.report,
    contracts: [
      hub.prepare.vaultRecord([vault.address]),
      hub.prepare.isVaultConnected([vault.address]),
      hub.prepare.vaultObligations([vault.address]),
      {
        abi: Multicall3AbiUtils,
        address: publicClient.chain.contracts.multicall3.address,
        functionName: 'getEthBalance',
        args: [address],
      },
      dashboard.prepare.totalValue(),
      dashboard.prepare.nodeOperatorDisbursableFee(),
      dashboard.prepare.withdrawableValue(),
      dashboard.prepare.nodeOperatorFeeRate(),
      dashboard.prepare.totalMintingCapacityShares(),
      dashboard.prepare.remainingMintingCapacityShares([0n]),
      operatorGrid.prepare.vaultInfo([vault.address]),
      operatorGrid.prepare.group([vault.nodeOperator]),
    ] as const,
  });

  const {
    liabilityShares,
    inOutDelta: { value: inOutDelta },
    locked,
  } = record;

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
    lidoTVLSharesLimit,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToShares(locked),
    shares.convertToSteth(totalMintingCapacityShares),
    shares.convertToSteth(tierShareLimit),
    lidoV3Contract.read.getMaxMintableExternalShares(),
  ]);

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
    locked,
    lockedShares,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    nodeOperatorFeeRate,

    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    withdrawalCredentials,
    obligations,

    tierId,
    tierShareLimit,
    tierStETHLimit,
    ...rest,
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
    locked,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    nodeOperatorFeeRate: nodeOperatorFee,
    nodeOperator,
    isVaultConnected,
    obligations,
    mintableStETH,
    tierId,
    tierStETHLimit,
  } = vaultData;

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
    unsettledLidoFees: vaultData.obligations.unsettledLidoFees,
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
  const undisbursedNodeOperatorFee = toEthValue(nodeOperatorUnclaimedFee);

  const unsettledLidoFees = toEthValue(obligations.unsettledLidoFees);

  const feeObligationEth = toEthValue(
    obligations.unsettledLidoFees + nodeOperatorUnclaimedFee,
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
  const nodeOperatorFeeRate = formatPercent.format(
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
    balanceEth,
    undisbursedNodeOperatorFee,
    nodeOperatorFeeRate,
    collateral,
    pendingUnlockEth,
    isVaultConnected,
    netApr,
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
    carrySpreadApr,
    vaultData,
    vaultMetrics,
  };
};

export const useVaultOverviewData = () => {
  const { shares, publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery({
    queryKey: [...queryKeys.state, 'vault-overview-data'],
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useSingleVaultData] activeVault is not defined');

      const [vaultData, vaultMetrics] = await Promise.all([
        getVaultData({ publicClient, shares, vault: activeVault }),
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
