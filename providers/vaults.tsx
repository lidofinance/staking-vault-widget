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
  vaults: VaultInfo[];
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

const getUniqueVaultsByAddress = (
  prev: VaultInfo[],
  current: VaultInfo[],
): VaultInfo[] => {
  const vaultMap = new Map<Address, VaultInfo>();

  for (const vault of prev) {
    vaultMap.set(vault.address, vault);
  }

  for (const vault of current) {
    vaultMap.set(vault.address, vault);
  }

  return Array.from(vaultMap.values());
};

export const VaultProvider: FC<VaultProviderProps> = ({ children }) => {
  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [activeVault, setCurrentVault] = useState<VaultInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    vaults: allVaults,
    isLoading: isLoadingAllVaults,
    pagesCount,
    handlePagination,
  } = useVaultsDataAll();

  useEffect(() => {
    if (allVaults && allVaults?.length > 0 && !isLoadingAllVaults) {
      setVaults((prevState) => {
        return getUniqueVaultsByAddress(prevState, allVaults);
      });
    }
  }, [allVaults, isLoadingAllVaults]);

  const setActiveVault = useCallback(
    (address: Address) => {
      if (!isAddress(address)) {
        setError(`Invalid Ethereum address: ${address}`);
        return;
      }

      const vault = vaults.find((vault) => vault.address === address);

      if (vault) {
        setCurrentVault(vault);
      } else {
        setError(`Vault with address ${address} not found`);
        void router.push(AppPaths.main);
      }
    },
    [vaults, router],
  );

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
