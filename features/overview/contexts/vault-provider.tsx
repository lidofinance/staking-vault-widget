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
  vaults: Map<Address, VaultInfo>;
  activeVault: VaultInfo | null;
  setActiveVault: (address: Address) => void;
  isLoadingVault: boolean;
  isFetching: boolean;
}

const VaultContext = createContext<VaultContextType | null>(null);

interface VaultProviderProps {
  address: Address;
}

export const VaultProvider: FC<PropsWithChildren<VaultProviderProps>> = ({
  address,
  children,
}) => {
  const [vaults, setVaults] = useState<Map<Address, VaultInfo>>(new Map([]));
  const [activeVault, setCurrentVault] = useState<VaultInfo | null>(null);
  const router = useRouter();
  const addressPayload = useMemo(() => [address], [address]);

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

      const vault = vaults.get(address);
      if (vault) {
        setCurrentVault(vault);
      } else {
        void router.push(AppPaths.main);
      }
    },
    [vaults, router],
  );

  useEffect(() => {
    if (!activeVault && vaults.size > 0) {
      const vaultAddresses = Array.from(vaults.keys());
      setActiveVault(vaultAddresses[0]);
    }
  }, [activeVault, vaults, setActiveVault]);

  useEffect(() => {
    if (vaultInfo && vaultInfo.length > 0 && !isFetching) {
      setVaults((prevState) => {
        const [vault] = vaultInfo;
        return new Map([...prevState.entries(), [vault.address, vault]]);
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
