import {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { Address, isAddress } from 'viem';
import invariant from 'tiny-invariant';
import { AppPaths } from 'consts/urls';
import { useVaultsDataAll } from 'modules/web3/hooks/use-vaults-data-all';
import { VaultInfo } from 'types';

interface VaultsContextType {
  vaults: VaultInfo[] | undefined;
  activeVault: VaultInfo | null;
  setActiveVault: (address: Address) => void;
  isLoadingAllVaults: boolean;
  pagesCount: number;
  handlePagination: (page: number) => void;
  error: string | null;
  clearError: () => void;
}

const VaultsContext = createContext<VaultsContextType | null>(null);

interface VaultProviderProps {
  children: ReactNode;
}

export const VaultProvider: FC<VaultProviderProps> = ({ children }) => {
  const [activeVault, setCurrentVault] = useState<VaultInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    vaults,
    isLoading: isLoadingAllVaults,
    isFetching,
    pagesCount,
    handlePagination,
  } = useVaultsDataAll();

  const setActiveVault = useCallback(
    (address: Address) => {
      if (!isAddress(address)) {
        void router.replace(AppPaths.notFound);
      }

      // TODO: add fetch info about particular vault by address
      const vault = vaults?.find((vault) => vault.address === address);

      if (vault) {
        setCurrentVault(vault);
      } else {
        void router.replace(AppPaths.notFound);
      }
    },
    [vaults, router],
  );

  useEffect(() => {
    const queryAddress = router.query?.vaultAddress;
    if (
      queryAddress &&
      queryAddress !== activeVault?.address &&
      vaults?.length &&
      !isFetching
    ) {
      setActiveVault(queryAddress as Address);
    }
  }, [
    vaults,
    router.query?.vaultAddress,
    isFetching,
    activeVault?.address,
    setActiveVault,
  ]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      vaults,
      activeVault,
      setActiveVault,
      isLoadingAllVaults,
      pagesCount,
      handlePagination,
      error,
      clearError,
    }),
    [
      vaults,
      activeVault,
      setActiveVault,
      isLoadingAllVaults,
      pagesCount,
      handlePagination,
      error,
      clearError,
    ],
  );

  return (
    <VaultsContext.Provider value={value}>{children}</VaultsContext.Provider>
  );
};

export const useVaults = (): VaultsContextType => {
  const context = useContext(VaultsContext);
  invariant(context, 'useVaults must be used within an VaultProvider');
  return context;
};
