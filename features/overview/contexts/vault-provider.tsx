import {
  FC,
  createContext,
  useContext,
  PropsWithChildren,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { Address, isAddress } from 'viem';
import invariant from 'tiny-invariant';
import { useSingleVaultData } from 'modules/vaults/hooks/use-vault-data';
import { VaultInfo } from 'types';

type VaultContextType = {
  vaultAddress: Address | undefined;
  activeVault?: VaultInfo;
  isLoadingVault?: boolean;
  error: Error | null;
  refetch: () => void;
};

const VaultContext = createContext<VaultContextType | null>(null);
VaultContext.displayName = 'VaultContext';

export const VaultProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { vaultAddress = '' } = router.query as { vaultAddress?: Address };
  const sanitizedVaultAddress = isAddress(vaultAddress)
    ? vaultAddress
    : undefined;
  const query = useSingleVaultData(sanitizedVaultAddress);

  const contextValue = useMemo<VaultContextType>(
    () => ({
      vaultAddress: sanitizedVaultAddress,
      activeVault: query.data,
      isLoadingVault: query.isPending,
      error: query.error,
      refetch: query.refetch,
    }),
    [
      sanitizedVaultAddress,
      query.data,
      query.isPending,
      query.error,
      query.refetch,
    ],
  );

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
