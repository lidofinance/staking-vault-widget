import { useState, useEffect } from 'react';

import { VaultTable } from 'features/home/vault-table';
import { Loader, Pagination } from '@lidofinance/lido-ui';
import { AllVaultsWrapper } from './styles';

import { useVaultsDataAll } from 'modules/web3/hooks/use-vaults-data-all';

import { VaultInfo } from 'types';

export const AllVaults = () => {
  const { vaults = [], isLoading } = useVaultsDataAll();
  const [paginationIndex, setPaginationIndex] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [vaultForRender, setVaultForRender] = useState<VaultInfo[]>(vaults);
  const pagesCount = Math.ceil(vaults.length / 4);

  useEffect(() => {
    if (vaults?.length) {
      setVaultForRender(vaults.slice(0, 4));
    }
  }, [vaults]);

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
        showTitle={!isLoading}
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
