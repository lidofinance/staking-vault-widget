import { useState, useEffect } from 'react';

import { VaultTable } from 'features/home/vault-table';
import { Loader, Pagination } from '@lidofinance/lido-ui';
import { AllVaultsWrapper } from './styles';

import { useVaultData } from 'shared/hooks/use-vault-data';
import { useVaultsConnected } from 'modules/web3/hooks/use-vaults-connected';

import { VaultInfo } from 'types';

export const AllVaults = () => {
  const { data: connectedVaults, isLoading: isLoadingConnected } =
    useVaultsConnected();
  const { vaultsData, isLoading } = useVaultData(connectedVaults);
  const vaults = vaultsData?.vaults ?? [];
  const [paginationIndex, setPaginationIndex] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [vaultForRender, setVaultForRender] = useState<VaultInfo[]>(() =>
    vaults.slice(currentIndex, 4),
  );
  const pagesCount = Math.ceil(vaults.length / 4);

  useEffect(() => {
    if (vaultsData?.vaults) {
      setVaultForRender(vaultsData?.vaults.slice(0, 4));
    }
  }, [vaultsData?.vaults]);

  const handleItemClick = (index: number) => {
    const newCurrentIndex =
      paginationIndex > index ? currentIndex - 4 : currentIndex + 4;
    const newSlice = vaults.slice(newCurrentIndex, index * 4);
    setVaultForRender(newSlice);
    setCurrentIndex(newCurrentIndex);
    setPaginationIndex(index);
  };

  return (
    <AllVaultsWrapper>
      <VaultTable
        title="All Vaults"
        vaults={vaultForRender}
        showTitle={!(isLoadingConnected || isLoading)}
      />
      {vaults.length > 4 && (
        <Pagination
          onItemClick={handleItemClick}
          pagesCount={pagesCount}
          siblingCount={1}
        />
      )}
      {isLoading && <Loader color="primary" size="large" />}
    </AllVaultsWrapper>
  );
};
