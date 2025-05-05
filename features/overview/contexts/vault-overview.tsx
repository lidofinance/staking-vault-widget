import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import { Address } from 'viem';
import invariant from 'tiny-invariant';
import { calculateOverview } from '@lidofinance/lsv-cli/dist/utils/calculate-overview';

import { formatBalance, formatPercent } from 'utils';

import { useVaultInfo } from 'modules/vaults/vault-context';
import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';

export interface VaultOverviewContextType {
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
    withdrawableEth: string;
    balanceEth: string;
    accumulatedFee: string;
    nodeOperatorFee: string;
    collateral: string;
    pendingUnlockEth: string;
  };
  isLoadingVault?: boolean;
  getVaultDataToRender: (
    payload: SectionPayload[],
  ) => (SectionPayload & { payload: string | Address | number })[];
}

export type VaultOverviewContextKeys = keyof VaultOverviewContextType['values'];
export type SectionPayload = {
  title: string;
  key: VaultOverviewContextKeys;
  actionText?: string;
  actionLink?: string;
  isLoading?: boolean;
};

const VaultOverviewContext = createContext<VaultOverviewContextType | null>(
  null,
);

const toEthValue = (value: bigint) => `${formatBalance(value).trimmed} ETH`;
const toStethValue = (value: bigint) => `${formatBalance(value).trimmed} stETH`;

export const VaultOverviewProvider: FC<PropsWithChildren> = ({ children }) => {
  const { activeVault, isLoadingVault } = useVaultInfo();

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
        nodeOperatorFeeBP,
        nodeOperator,
      } = activeVault;

      const overview = calculateOverview({
        totalValue: activeVault.totalValue,
        reserveRatioBP: activeVault.reserveRatioBP,
        liabilitySharesInStethWei: activeVault.liabilityStETH,
        forceRebalanceThresholdBP: activeVault.forcedRebalanceThresholdBP,
        withdrawableEther: activeVault.withdrawableEther,
        balance: activeVault.balance,
        locked: activeVault.locked,
        nodeOperatorUnclaimedFee: activeVault.nodeOperatorUnclaimedFee,
        totalMintingCapacity: activeVault.totalMintingCapacity,
      });

      const totalValue = toEthValue(activeVault.totalValue);
      const totalLocked = toEthValue(locked + nodeOperatorUnclaimedFee);
      const liabilityStETH = toStethValue(activeVault.liabilityStETH);
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
      const totalMintingCapacity = toStethValue(overview.totalMintingCapacity);
      const accumulatedFee = toEthValue(nodeOperatorUnclaimedFee);
      const nodeOperatorFee = formatPercent.format(
        Number(nodeOperatorFeeBP) / VAULT_TOTAL_BASIS_POINTS,
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
        withdrawableEth,
        balanceEth,
        accumulatedFee,
        nodeOperatorFee,
        collateral,
        pendingUnlockEth,
        isLoadingVault,
      };
    }

    return {} as VaultOverviewContextType['values'];
  }, [activeVault, isLoadingVault]);

  const getVaultDataToRender = useCallback(
    (sectionPayloadList: SectionPayload[]) => {
      return sectionPayloadList.map((item) => {
        return {
          ...item,
          payload: values[item.key],
          isLoading: isLoadingVault,
        };
      });
    },
    [values, isLoadingVault],
  );

  return (
    <VaultOverviewContext.Provider value={{ values, getVaultDataToRender }}>
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
