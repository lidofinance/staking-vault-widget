import { useVaultOverviewData } from 'modules/vaults';
import { bigIntMax } from 'utils/bigint-math';

export const useCheckAvailability = () => {
  const { isLoading, isError, isPending, data } = useVaultOverviewData();
  const {
    vaultLiabilityStETH = 0n,
    unsettledLidoFees = 0n,
    availableBalanceWei = 0n,
    balance = 0n,
    totalValueETH = 0n,
  } = data ?? {};

  const hasMintedStETH = vaultLiabilityStETH > 0n;
  const isNeedSupplyForFees = availableBalanceWei < unsettledLidoFees;
  const supplyBalanceForFees = bigIntMax(
    unsettledLidoFees - availableBalanceWei,
    0n,
  );

  return {
    isLoading: isLoading || isPending,
    isError,
    vaultLiabilityStETH,
    unsettledLidoFees,
    availableBalanceWei,
    hasMintedStETH,
    isNeedSupplyForFees,
    supplyBalanceForFees,
    balance,
    totalValueETH,
  };
};
