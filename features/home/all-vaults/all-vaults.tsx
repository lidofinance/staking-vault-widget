import { VaultTable } from 'features/home/vault-table';
import { Loader, Pagination } from '@lidofinance/lido-ui';
import { AllVaultsWrapper } from './styles';

import { useVaultsDataAll } from 'modules/web3/hooks/use-vaults-data-all';

export const AllVaults = () => {
  const {
    vaults = [],
    isLoading,
    pagesCount,
    handlePagination,
  } = useVaultsDataAll();
  const showPagination = !!pagesCount;

  return (
    <AllVaultsWrapper>
      <VaultTable title="All Vaults" vaults={vaults} showTitle={!isLoading} />
      {showPagination && (
        <Pagination
          onItemClick={handlePagination}
          pagesCount={pagesCount}
          siblingCount={1}
        />
      )}
      {isLoading && <Loader color="primary" size="large" />}
    </AllVaultsWrapper>
  );
};
