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
import { useVaultInfo } from './vault-provider';
import { VAULT_TOTAL_BASIS_POINTS } from 'consts/vault-hub';
import { formatBalance, formatPercent } from 'utils';
import { bigIntMin } from 'utils/bigint-math';

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
    mintedEth: string;
    totalMintingCapacity: string;
    withdrawableEth: string;
    balanceEth: string;
    depositedToValidators: string;
    accumulatedFee: string;
    nodeOperatorFee: string;
  };
  getVaultDataToRender: (
    payload: SectionPayload[],
  ) => (SectionPayload & { payload: string | Address })[];
}

export type VaultOverviewContextKeys = keyof VaultOverviewContextType['values'];
export type SectionPayload = { title: string; key: VaultOverviewContextKeys };

const VaultOverviewContext = createContext<VaultOverviewContextType | null>(
  null,
);

const toEthValue = (value: bigint) => `${formatBalance(value).trimmed} ETH`;

export const VaultOverviewProvider: FC<PropsWithChildren> = ({ children }) => {
  const { activeVault } = useVaultInfo();

  const values: VaultOverviewContextType['values'] = useMemo(() => {
    if (activeVault) {
      const {
        address,
        valuation,
        minted,
        healthScore,
        reserveRatioBP,
        rebalanceThresholdBP,
        locked,
        nodeOperatorUnclaimedFee,
        ethLimit,
        withdrawableEther,
        balance,
        nodeOperatorFeeBP,
        nodeOperator,
      } = activeVault;

      const totalValue = toEthValue(valuation);
      const totalLocked = toEthValue(locked);
      const mintedEth = toEthValue(minted);
      const withdrawableEth = toEthValue(withdrawableEther);
      const balanceEth = toEthValue(balance);
      const reserveRatio = formatPercent.format(
        reserveRatioBP / VAULT_TOTAL_BASIS_POINTS,
      );
      const rebalanceThreshold = formatPercent.format(
        rebalanceThresholdBP / VAULT_TOTAL_BASIS_POINTS,
      );
      const healthFactor = formatPercent.format(healthScore);
      const utilization =
        minted === 0n
          ? Infinity
          : minted /
            (minted * BigInt(VAULT_TOTAL_BASIS_POINTS - reserveRatioBP));
      const utilizationRatio = formatPercent.format(utilization);
      const totalMintingCapacity = toEthValue(
        bigIntMin(
          (valuation - nodeOperatorUnclaimedFee) *
            BigInt(VAULT_TOTAL_BASIS_POINTS - reserveRatioBP),
          ethLimit,
        ),
      );
      const depositedToValidators = toEthValue(valuation - balance);
      const accumulatedFee = toEthValue(nodeOperatorUnclaimedFee);
      const nodeOperatorFee = formatPercent.format(
        Number(nodeOperatorFeeBP) / VAULT_TOTAL_BASIS_POINTS,
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
        mintedEth,
        totalMintingCapacity,
        withdrawableEth,
        balanceEth,
        depositedToValidators,
        accumulatedFee,
        nodeOperatorFee,
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
