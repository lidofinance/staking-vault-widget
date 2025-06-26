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

import { useLidoSDK } from 'modules/web3';

import { useBaseVaultData } from './use-base-vault-data';
import {
  VaultAddressError,
  VaultConfigScopes,
  vaultQueryKeys,
} from '../consts';
import type { VaultBaseInfo } from '../types';

type VaultContextType = {
  vaultAddress?: Address;
  activeVault?: VaultBaseInfo;
  queryKeys: ReturnType<typeof vaultQueryKeys>;
  invalidateVaultState: () => Promise<void>;
  invalidateVaultConfig: (scope?: VaultConfigScopes) => Promise<void>;
  invalidateVault: () => Promise<void>;
  error: Error | null;
} & Omit<ReturnType<typeof useBaseVaultData>, 'error'>;

const VaultContext = createContext<VaultContextType | null>(null);
VaultContext.displayName = 'VaultContext';

export const VaultProvider: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { publicClient } = useLidoSDK();
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
      publicClient.chain.id,
      query.data?.hubReport.cid,
    );
    return {
      ...query,
      vaultAddress: sanitizedVaultAddress,
      activeVault: query.data,
      queryKeys,
      error:
        (vaultAddress && !sanitizedVaultAddress && new VaultAddressError()) ||
        query.error,
      invalidateVaultState: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.stateBase }),
      invalidateVaultConfig: (scope?: VaultConfigScopes) =>
        queryClient.invalidateQueries({ queryKey: queryKeys.config(scope) }),
      invalidateVault: () =>
        queryClient.invalidateQueries({ queryKey: queryKeys.base }),
    };
  }, [
    sanitizedVaultAddress,
    publicClient.chain.id,
    query,
    vaultAddress,
    queryClient,
  ]);

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
