import { Loader, Pagination } from '@lidofinance/lido-ui';
import { VaultTable } from 'features/home/components/vault-table';
import { AllVaultsWrapper } from './styles';
import { useVaultsDataAll } from 'modules/vaults';

export const AllVaults = () => {
  const {
    vaults,
    isLoading: isLoadingAllVaults,
    pagesCount,
    handlePagination,
    page,
  } = useVaultsDataAll();
  const showPagination = !!pagesCount;

  return (
    <AllVaultsWrapper>
      <VaultTable
        title="All Vaults"
        vaults={vaults}
        showTitle={!isLoadingAllVaults}
      />
      {isLoadingAllVaults && <Loader color="primary" size="large" />}
      {showPagination && !isLoadingAllVaults && (
        <Pagination
          onItemClick={handlePagination}
          pagesCount={pagesCount}
          siblingCount={1}
          activePage={page}
        />
      )}
    </AllVaultsWrapper>
  );
};
