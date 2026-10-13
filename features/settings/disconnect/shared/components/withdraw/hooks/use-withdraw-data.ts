import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { fetchVaultInfo, useVault } from 'modules/vaults';

const TOTAL_VALUE_STALE_TIME = 300000;

export const useWithdrawData = () => {
  const { activeVault, queryKeys } = useVault();

  // last known total value comes from the API: on-chain total value is read
  // through the Dashboard/VaultHub, which is no longer meaningful once the
  // vault is disconnected and the Dashboard abandoned
  const totalValueQuery = useQuery({
    queryKey: [...queryKeys.base, 'disconnect-withdraw-total-value'] as const,
    enabled: !!activeVault,
    staleTime: TOTAL_VALUE_STALE_TIME,
    queryFn: async () => {
      invariant(activeVault, '[useWithdrawData] activeVault is not defined');

      const { totalValue } = await fetchVaultInfo({
        vaultAddress: activeVault.address,
      });

      return totalValue;
    },
  });

  // the vault contract itself stays readable after disconnection
  const availableBalanceQuery = useQuery({
    queryKey: [
      ...queryKeys.state,
      'disconnect-vault-available-balance',
    ] as const,
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useWithdrawData] activeVault is not defined');

      return activeVault.vault.read.availableBalance();
    },
  });

  return {
    totalValue: totalValueQuery.data ?? 0n,
    isTotalValueLoading: totalValueQuery.isLoading || totalValueQuery.isPending,
    availableBalance: availableBalanceQuery.data ?? 0n,
    isAvailableBalanceLoading:
      availableBalanceQuery.isLoading || availableBalanceQuery.isPending,
  };
};
