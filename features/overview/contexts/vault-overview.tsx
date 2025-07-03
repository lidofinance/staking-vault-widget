import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { Address } from 'viem';
import invariant from 'tiny-invariant';
import { calculateOverviewV2 } from '@lidofinance/lsv-cli/dist/utils/calculate-overview-v2';

import { formatBalance, formatPercent } from 'utils';

import { useVaultInfo } from 'modules/vaults/vault-context';
import { useVaultLatestMetrics } from 'modules/vaults/hooks';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ALL_ROLES,
  vaultTexts,
} from 'modules/vaults';

export type SectionData = {
  indicator: VaultOverviewContextKeys;
  actionRole?: VAULTS_ALL_ROLES;
  actionLink?: (vaultAddress: Address) => string;
  textSize?: 'lg' | 'xl';
};

export type SectionPayload = SectionData & {
  title: string;
  learnMoreLink: string;
  description?: string;
  hint?: string;
  isLoading?: boolean;
  payload: string | Address | number | boolean;
};

export type VaultOverviewContextType = {
  values: {
    address: Address;
    nodeOperator: Address;
    totalValue: string;
    reserveRatio: string;
    utilizationRatio: string;
    rebalanceThreshold: string;
    healthFactor: string;
    healthFactorNumber: number;
    totalLocked: string;
    liabilityStETH: string;
    totalMintingCapacity: string;
    totalMintingCapacityStETH: string;
    withdrawableEth: string;
    balanceEth: string;
    undisbursedNodeOperatorFee: string;
    nodeOperatorFeeRate: string;
    collateral: string;
    pendingUnlockEth: string;
    netApr: string;
    unsettledLidoFees: string;
    isVaultConnected: boolean;
    remainingMintingCapacity: string;
    tierId: string;
    tierLimitStETH: string;
    // TODO: re-check fee
    feeObligationEth: string;

    // TODO: replace
    rebaseRewardEth: string;
    grossStakingRewardsEth: string;
    nodeOperatorRewardsEth: string;
    dailyLidoFees: bigint;
    netStakingRewardsEth: string;
    grossStakingAPR: number;
    grossStakingAprBps: number;
    grossStakingAprPercent: number;
    netStakingAPR: number;
    netStakingAprBps: number;
    bottomLineEth: string;
    carrySpreadAPR: number;
    carrySpreadAprBps: number;
    carrySpreadApr: string;
    isLoadingMetrics: boolean;
    isLoading: boolean;
  };
  isLoadingVault?: boolean;
  getVaultDataToRender: (payload: SectionData) => SectionPayload;
};

export type VaultOverviewContextKeys = keyof VaultOverviewContextType['values'];

type MetricText = {
  title: string;
  learnMoreLink: string;
  description?: string;
  hint?: string;
};

const VaultOverviewContext = createContext<VaultOverviewContextType | null>(
  null,
);
VaultOverviewContext.displayName = 'VaultOverviewContext';

const toEthValue = (value: bigint | undefined) =>
  typeof value === 'bigint' ? `${formatBalance(value).trimmed} ETH` : '';
const toStethValue = (value: bigint | undefined) =>
  typeof value === 'bigint' ? `${formatBalance(value).trimmed} stETH` : '';

const getMetricTexts = (key: VaultOverviewContextKeys): MetricText => {
  const metric = vaultTexts.metrics[
    key as keyof typeof vaultTexts.metrics
  ] as MetricText;

  return metric ?? {};
};

export const VaultOverviewProvider: FC<PropsWithChildren> = ({ children }) => {
  const { activeVault, isLoadingVault, vaultAddress } = useVaultInfo();
  const { data: vaultMetricsData, isLoadingMetrics } =
    useVaultLatestMetrics(vaultAddress);

  const values: VaultOverviewContextType['values'] = useMemo(() => {
    if (activeVault) {
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
      } = activeVault;

      const {
        rebaseReward,
        grossStakingRewards,
        nodeOperatorRewards,
        dailyLidoFees,
        netStakingRewards,
        grossStakingAPR,
        grossStakingAprBps,
        grossStakingAprPercent,
        netStakingAPR,
        netStakingAprBps,
        netStakingAprPercent,
        bottomLine,
        carrySpreadAPR,
        carrySpreadAprBps,
        carrySpreadAprPercent,
      } = vaultMetricsData;

      const overview = calculateOverviewV2({
        totalValue: activeVault.totalValue,
        reserveRatioBP: reserveRatioBP,
        liabilitySharesInStethWei: activeVault.liabilityStETH,
        forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
        withdrawableEther: activeVault.withdrawableEther,
        balance: activeVault.balance,
        locked: activeVault.locked,
        nodeOperatorDisbursableFee: activeVault.nodeOperatorUnclaimedFee,
        totalMintingCapacityStethWei: activeVault.totalMintingCapacityStETH,
        unsettledLidoFees: activeVault.obligations.unsettledLidoFees,
      });

      const totalValue = toEthValue(activeVault.totalValue);
      const totalLocked = toEthValue(locked + nodeOperatorUnclaimedFee);
      const liabilityStETH = toStethValue(activeVault.liabilityStETH);
      const tierLimitStETH = toStethValue(tierStETHLimit);
      const withdrawableEth = toEthValue(withdrawableEther);
      const balanceEth = toEthValue(balance);
      const remainingMintingCapacity = toStethValue(mintableStETH);
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
      const totalMintingCapacity = toStethValue(
        overview.totalMintingCapacityStethWei,
      );
      const totalMintingCapacityStETH = toStethValue(
        activeVault.totalMintingCapacityStETH,
      );
      const undisbursedNodeOperatorFee = toEthValue(nodeOperatorUnclaimedFee);
      const nodeOperatorFeeRate = formatPercent.format(
        Number(nodeOperatorFee) / VAULT_TOTAL_BASIS_POINTS,
      );
      const collateral = toEthValue(overview.collateral);
      const pendingUnlock = overview.recentlyRepaid;
      const pendingUnlockEth = toEthValue(
        pendingUnlock > 0n ? pendingUnlock : 0n,
      );

      // TODO: update fn's for undefined properties
      const netApr =
        netStakingAprPercent &&
        formatPercent.format(netStakingAprPercent / 100);
      const carrySpreadApr =
        carrySpreadAprPercent &&
        formatPercent.format(carrySpreadAprPercent / 100);
      const unsettledLidoFees = toEthValue(obligations.unsettledLidoFees);
      const feeObligationEth = toEthValue(
        obligations.unsettledLidoFees + nodeOperatorUnclaimedFee,
      );

      return {
        address,
        nodeOperator,
        totalValue,
        reserveRatio,
        utilizationRatio,
        rebalanceThreshold,
        healthFactor,
        healthFactorNumber,
        totalLocked,
        liabilityStETH,
        totalMintingCapacity,
        totalMintingCapacityStETH,
        withdrawableEth,
        balanceEth,
        undisbursedNodeOperatorFee,
        nodeOperatorFeeRate,
        collateral,
        pendingUnlockEth,
        isLoadingVault,
        isLoadingMetrics,
        isVaultConnected,
        netApr,
        unsettledLidoFees,
        remainingMintingCapacity,
        feeObligationEth,
        tierId,
        tierLimitStETH,

        // TODO: replace by preparedData
        rebaseRewardEth: toStethValue(rebaseReward),
        grossStakingRewardsEth: toEthValue(grossStakingRewards),
        nodeOperatorRewardsEth: toEthValue(nodeOperatorRewards),
        dailyLidoFees,
        netStakingRewardsEth: toEthValue(netStakingRewards),
        grossStakingAPR,
        grossStakingAprBps,
        grossStakingAprPercent,
        netStakingAPR,
        netStakingAprBps,
        bottomLineEth: toEthValue(bottomLine),
        carrySpreadAPR,
        carrySpreadAprBps,
        carrySpreadApr,
        isLoading: isLoadingMetrics || isLoadingVault,
      };
    }

    return {} as VaultOverviewContextType['values'];
  }, [activeVault, isLoadingVault, vaultMetricsData, isLoadingMetrics]);

  const value = useMemo(() => {
    return {
      values,
      isLoadingVault,
      getVaultDataToRender: (sectionEntry: SectionData) => ({
        ...sectionEntry,
        ...getMetricTexts(sectionEntry.indicator),
        payload: values[sectionEntry.indicator],
        isLoading: isLoadingVault,
      }),
    };
  }, [isLoadingVault, values]);

  return (
    <VaultOverviewContext.Provider value={value}>
      {children}
    </VaultOverviewContext.Provider>
  );
};

export const useVaultOverview = (): VaultOverviewContextType => {
  const context = useContext(VaultOverviewContext);
  invariant(
    context,
    'useVaultOverview must be used within an VaultOverviewProvider',
  );
  return context;
};
