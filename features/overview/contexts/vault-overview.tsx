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

import { useVaultInfo } from './vault-provider';
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
    totalLocked: string;
    liabilityStETH: string;
    totalMintingCapacity: string;
    withdrawableEth: string;
    balanceEth: string;
    depositedToValidators: string;
    accumulatedFee: string;
    nodeOperatorFee: string;
    collateral: string;
    pendingUnlockEth: string;
  };
  getVaultDataToRender: (
    payload: SectionPayload[],
  ) => (SectionPayload & { payload: string | Address })[];
}

export type VaultOverviewContextKeys = keyof VaultOverviewContextType['values'];
export type SectionPayload = {
  title: string;
  key: VaultOverviewContextKeys;
  actionText?: string;
  actionLink?: string;
};

const VaultOverviewContext = createContext<VaultOverviewContextType | null>(
  null,
);

const toEthValue = (value: bigint) => `${formatBalance(value).trimmed} ETH`;
const toStethValue = (value: bigint) => `${formatBalance(value).trimmed} stETH`;

export const VaultOverviewProvider: FC<PropsWithChildren> = ({ children }) => {
  const { activeVault } = useVaultInfo();

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

      const overview = calculateOverview(
        activeVault.totalValue,
        activeVault.reserveRatioBP,
        activeVault.liabilityStETH,
        activeVault.forcedRebalanceThresholdBP,
        activeVault.withdrawableEther,
        activeVault.balance,
        activeVault.locked,
        activeVault.nodeOperatorUnclaimedFee,
        activeVault.totalMintingCapacity,
      );

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
      const healthFactor = formatPercent.format(healthScore);
      const utilizationRatio = formatPercent.format(overview.utilizationRatio);
      const totalMintingCapacity = toStethValue(overview.totalMintingCapacity);
      const depositedToValidators = toEthValue(overview.depositedToValidators);
      const accumulatedFee = toEthValue(overview.lockedByAccumulatedFees);
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
        totalLocked,
        liabilityStETH,
        totalMintingCapacity,
        withdrawableEth,
        balanceEth,
        depositedToValidators,
        accumulatedFee,
        nodeOperatorFee,
        collateral,
        pendingUnlockEth,
      };
    }

    return {} as VaultOverviewContextType['values'];
  }, [activeVault]);

  const getVaultDataToRender = useCallback(
    (sectionPayloadList: SectionPayload[]) => {
      return sectionPayloadList.map((item) => {
        return { ...item, payload: values[item.key] };
      });
    },
    [values],
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
