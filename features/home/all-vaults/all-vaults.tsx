import { useVaults } from 'providers/vaults';

import { Loader, Pagination } from '@lidofinance/lido-ui';
import { VaultTable } from 'features/home/vault-table';
import { AllVaultsWrapper } from './styles';

export const AllVaults = () => {
  const { vaults, isLoadingAllVaults, pagesCount, handlePagination } =
    useVaults();
  const showPagination = !!pagesCount;

  return (
    <AllVaultsWrapper>
      <VaultTable
        title="All Vaults"
        vaults={vaults}
        showTitle={!isLoadingAllVaults}
      />
      {showPagination && (
        <Pagination
          onItemClick={handlePagination}
          pagesCount={pagesCount}
          siblingCount={1}
        />
      )}
      {isLoadingAllVaults && <Loader color="primary" size="large" />}
    </AllVaultsWrapper>
  );
};
