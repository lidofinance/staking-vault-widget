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
import { useQueryClient } from '@tanstack/react-query';

import { useBaseVaultData } from './use-base-vault-data';
import { VaultConfigScopes, vaultQueryKeys } from '../consts';
import type { VaultBaseInfo } from '../types';

type VaultContextType = {
  vaultAddress?: Address;
  activeVault?: VaultBaseInfo;
  queryKeys: ReturnType<typeof vaultQueryKeys>;
  invalidateVaultState: () => Promise<void>;
  invalidateVaultConfig: (scope?: VaultConfigScopes) => Promise<void>;
  invalidateVault: () => Promise<void>;
  error: VaultAddressError | Error | null;
} & Omit<ReturnType<typeof useBaseVaultData>, 'error'>;

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
  const queryClient = useQueryClient();
  const { vaultAddress = '' } = router.query as { vaultAddress?: Address };
  const sanitizedVaultAddress = isAddress(vaultAddress.toLowerCase())
    ? (vaultAddress.toLowerCase() as Address)
    : undefined;
  const query = useBaseVaultData(sanitizedVaultAddress);

  useEffect(() => {
    if (query.error)
      console.error(
        `[VaultProvider] error fetching ${vaultAddress}`,
        query.error,
      );
  }, [query.error, vaultAddress]);

  const contextValue = useMemo<VaultContextType>(() => {
    const queryKeys = vaultQueryKeys(
      sanitizedVaultAddress,
      query.data?.hub.chain.id,
      query.data?.reportCID,
    );
    return {
      ...query,
      vaultAddress: sanitizedVaultAddress,
      activeVault: query.data,
      queryKeys,
      error:
        (vaultAddress &&
          !sanitizedVaultAddress &&
          new VaultAddressError(vaultAddress)) ||
        query.error,
      invalidateVaultState: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.stateBase }),
      invalidateVaultConfig: (scope?: VaultConfigScopes) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.config(scope) }),
      invalidateVault: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.base }),
    };
  }, [sanitizedVaultAddress, query, vaultAddress, queryClient]);

  return (
    <VaultContext.Provider value={contextValue}>
      {children}
    </VaultContext.Provider>
  );
};

export const useVault = (): VaultContextType => {
  const context = useContext(VaultContext);
  invariant(context, 'useVault must be used within an VaultProvider');
  return context;
};
