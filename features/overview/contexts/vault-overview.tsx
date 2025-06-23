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
import {
  useSingleVaultData,
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ALL_ROLES,
  vaultTexts,
} from 'modules/vaults';

export type SectionData = {
  key: VaultOverviewContextKeys;
  actionRole?: VAULTS_ALL_ROLES;
  actionLink?: (vaultAddress: Address) => string;
};

export type SectionPayload = SectionData & {
  title: string;
  hint?: string;
  action?: string;
  isLoading?: boolean;
  payload: string | Address | number;
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
    accumulatedFee: string;
    nodeOperatorFeeRate: string;
    collateral: string;
    pendingUnlockEth: string;
  };
  isLoadingVault?: boolean;
  getVaultDataToRender: (payload: SectionData) => SectionPayload;
};

export type VaultOverviewContextKeys = keyof VaultOverviewContextType['values'];

type MetricText = {
  title: string;
  hint?: string;
  action?: string;
};

const VaultOverviewContext = createContext<VaultOverviewContextType | null>(
  null,
);
VaultOverviewContext.displayName = 'VaultOverviewContext';

const toEthValue = (value: bigint) => `${formatBalance(value).trimmed} ETH`;
const toStethValue = (value: bigint) => `${formatBalance(value).trimmed} stETH`;

const getMetricTexts = (key: VaultOverviewContextKeys): MetricText => {
  const metric = vaultTexts.metrics[
    key as keyof typeof vaultTexts.metrics
  ] as MetricText;
  invariant(metric, `Metric text for ${key} not found`);
  return metric;
};

export const VaultOverviewProvider: FC<PropsWithChildren> = ({ children }) => {
  const { activeVault, isLoadingVault: isLoadingVaultCore } = useVaultInfo();

  const { data: vaultData, isLoading: isLoadingVaultData } = useSingleVaultData(
    activeVault?.address,
  );

  const isLoadingVault = isLoadingVaultCore || isLoadingVaultData;

  const values: VaultOverviewContextType['values'] = useMemo(() => {
    if (vaultData) {
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
      } = vaultData;

      const overview = calculateOverviewV2({
        totalValue: vaultData.totalValue,
        reserveRatioBP: vaultData.reserveRatioBP,
        liabilitySharesInStethWei: vaultData.liabilityStETH,
        liabilitySharesInWei: vaultData.liabilityShares,
        forceRebalanceThresholdBP: vaultData.forcedRebalanceThresholdBP,
        withdrawableEther: vaultData.withdrawableEther,
        balance: vaultData.balance,
        locked: vaultData.locked,
        nodeOperatorUnclaimedFee: vaultData.nodeOperatorUnclaimedFee,
        totalMintingCapacityStethWei: vaultData.totalMintingCapacityStETH,
        totalMintingCapacitySharesInWei: vaultData.totalMintingCapacity,
      });

      const totalValue = toEthValue(vaultData.totalValue);
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
      const totalMintingCapacity = toStethValue(
        overview.totalMintingCapacityStethWei,
      );
      const totalMintingCapacityStETH = toStethValue(
        vaultData.totalMintingCapacityStETH,
      );
      const accumulatedFee = toEthValue(nodeOperatorUnclaimedFee);
      const nodeOperatorFeeRate = formatPercent.format(
        Number(nodeOperatorFee) / VAULT_TOTAL_BASIS_POINTS,
      );
      const collateral = toEthValue(overview.collateral);
      const pendingUnlock = overview.PendingUnlock;
      const pendingUnlockEth = toEthValue(
        pendingUnlock > 0n ? pendingUnlock : 0n,
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
        accumulatedFee,
        nodeOperatorFeeRate,
        collateral,
        pendingUnlockEth,
        isLoadingVault,
      };
    }

    return {} as VaultOverviewContextType['values'];
  }, [vaultData, isLoadingVault]);

  const value = useMemo(() => {
    return {
      values,
      getVaultDataToRender: (sectionEntry: SectionData) => ({
        ...sectionEntry,
        ...getMetricTexts(sectionEntry.key),
        payload: values[sectionEntry.key],
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
