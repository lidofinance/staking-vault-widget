import {
  FC,
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  PropsWithChildren,
  useMemo,
} from 'react';
import { useRouter } from 'next/router';
import { Address, isAddress } from 'viem';
import invariant from 'tiny-invariant';
import { AppPaths } from 'consts/urls';
import { useVaultData } from 'shared/hooks/use-vault-data';
import { VaultInfo } from 'types';

interface VaultContextType {
  vaults: VaultInfo[];
  activeVault: VaultInfo | null;
  setActiveVault: (address: Address) => void;
  isLoadingVault: boolean;
  isFetching: boolean;
}

const VaultContext = createContext<VaultContextType | null>(null);

export const VaultProvider: FC<PropsWithChildren> = ({ children }) => {
  const [vaults, setVaults] = useState<VaultInfo[]>([]);
  const [activeVault, setCurrentVault] = useState<VaultInfo | null>(null);
  const router = useRouter();
  const { vaultAddress } = router.query as { vaultAddress: Address };
  const addressPayload = useMemo(() => [vaultAddress], [vaultAddress]);

  const {
    data: vaultInfo,
    isFetching,
    isLoading: isLoadingVault,
  } = useVaultData(addressPayload);

  const setActiveVault = useCallback(
    (address: Address) => {
      if (!isAddress(address)) {
        return;
      }

      const vault = vaults.find((vault) => vault.address === address);
      if (vault) {
        setCurrentVault(vault);
      } else {
        void router.replace(AppPaths.notFound);
      }
    },
    [vaults, router],
  );

  useEffect(() => {
    if (!activeVault && vaults.length > 0) {
      setActiveVault(vaults[0].address);
    }
  }, [activeVault, vaults, setActiveVault]);

  useEffect(() => {
    if (vaultInfo && vaultInfo.length > 0 && !isFetching) {
      setVaults((prevState) => {
        return [...prevState, ...vaultInfo];
      });
    }
  }, [vaultInfo, isFetching]);

  const value = useMemo(
    () => ({
      vaults,
      activeVault,
      setActiveVault,
      isLoadingVault,
      isFetching,
    }),
    [vaults, activeVault, setActiveVault, isLoadingVault, isFetching],
  );

  return (
    <VaultContext.Provider value={value}>{children}</VaultContext.Provider>
  );
};

export const useVaultInfo = (): VaultContextType => {
  const context = useContext(VaultContext);
  invariant(context, 'useVaultInfo must be used within an VaultProvider');
  return context;
};
