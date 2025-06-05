import invariant from 'tiny-invariant';
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
import type { QueryObserverResult } from '@tanstack/react-query';

import { useSingleVaultData } from 'modules/vaults/hooks/use-vault-data';

import type { VaultInfo } from 'types';

type VaultContextType = {
  vaultAddress: Address | undefined;
  activeVault?: VaultInfo;
  refetchVaultInfo: () => Promise<QueryObserverResult<VaultInfo, Error>>;
  isLoadingVault: boolean;
} & Pick<ReturnType<typeof useSingleVaultData>, 'isRefetching' | 'error'>;

const VaultContext = createContext<VaultContextType | null>(null);
VaultContext.displayName = 'VaultContext';

export class VaultAddressError extends Error {
  constructor(vaultAddress: string) {
    super(`Vault address is not valid: ${vaultAddress}`);
    this.name = 'VaultAddressError';
  }
}

export const VaultProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { vaultAddress = '' } = router.query as { vaultAddress?: Address };
  const sanitizedVaultAddress = isAddress(vaultAddress.toLocaleLowerCase())
    ? (vaultAddress.toLocaleLowerCase() as Address)
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

      error:
        error ||
        (vaultAddress &&
          !sanitizedVaultAddress &&
          new VaultAddressError(vaultAddress)) ||
        null,
      refetchVaultInfo: () =>
        refetch({ cancelRefetch: true, throwOnError: false }),
      isRefetching: isRefetching,
    };
  }, [
    sanitizedVaultAddress,
    data,
    isPending,
    error,
    vaultAddress,
    isRefetching,
    refetch,
  ]);

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
