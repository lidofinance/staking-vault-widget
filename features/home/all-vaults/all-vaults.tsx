import { Loader, Pagination } from '@lidofinance/lido-ui';
import { VaultTable } from 'features/home/components/vault-table';
import { AllVaultsWrapper } from './styles';
import { useVaultsDataAll, VAULTS_PER_PAGE } from 'modules/vaults';
import { useConnectedVaultsNumber } from 'features/home/hooks';

export const AllVaults = () => {
  const {
    vaults,
    isLoading: isLoadingAllVaults,
    handlePagination,
  } = useVaultsDataAll();
  const { data } = useConnectedVaultsNumber();
  const pagesCount = Math.ceil(Number(data ?? 0) / VAULTS_PER_PAGE);
  const showPagination = !!vaults && vaults?.length > 0 && pagesCount > 1;

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
