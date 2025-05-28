import {
  FC,
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
  useEffect,
} from 'react';
import { useRouter } from 'next/router';
import { Address, isAddress } from 'viem';
import invariant from 'tiny-invariant';
import { useSingleVaultData } from 'modules/vaults/hooks/use-vault-data';
import { VaultInfo } from 'types';
import { QueryObserverResult } from '@tanstack/react-query';

type VaultContextType = {
  vaultAddress: Address | undefined;
  activeVault?: VaultInfo;
  refetchVaultInfo: () => Promise<QueryObserverResult<VaultInfo, Error>>;
  isLoadingVault: boolean;
} & Pick<ReturnType<typeof useSingleVaultData>, 'isRefetching' | 'error'>;

const VaultContext = createContext<VaultContextType | null>(null);
VaultContext.displayName = 'VaultContext';

export const VaultProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { vaultAddress = '' } = router.query as { vaultAddress?: Address };
  const sanitizedVaultAddress = isAddress(vaultAddress)
    ? vaultAddress
    : undefined;
  const { data, error, refetch, isPending, isRefetching } = useSingleVaultData(
    sanitizedVaultAddress,
  );

  useEffect(() => {
    if (error)
      console.error(`[VaultProvider] error fetching ${vaultAddress}`, error);
  }, [error, vaultAddress]);

  const contextValue = useMemo<VaultContextType>(() => {
    return {
      vaultAddress: sanitizedVaultAddress,
      activeVault: data,
      isLoadingVault: isPending,
      error: error,
      refetchVaultInfo: () =>
        refetch({ cancelRefetch: true, throwOnError: false }),
      isRefetching: isRefetching,
    };
  }, [sanitizedVaultAddress, data, isPending, error, isRefetching, refetch]);

  return (
    <VaultContext.Provider value={contextValue}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVaultInfo = (): VaultContextType => {
  const context = useContext(VaultContext);
  invariant(context, 'useVaultInfo must be used within an VaultProvider');
  return context;
};
