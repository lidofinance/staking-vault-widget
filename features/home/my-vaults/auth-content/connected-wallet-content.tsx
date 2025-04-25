import { Loader } from '@lidofinance/lido-ui';
import { VaultTable } from 'features/home/components/vault-table';
import { AddVault } from 'features/home/my-vaults/add-vault';

import { useVaultsDataByOwner } from 'modules/vaults/hooks/use-vaults-data-by-owner';
import { MyVaultsWrapper } from './styles';

export const ConnectedWalletContent = () => {
  const { vaults, isLoading } = useVaultsDataByOwner();

  return (
    <MyVaultsWrapper>
      <VaultTable
        title="My Vaults"
        vaults={vaults}
        showTitle
        vaultsCount={vaults?.length ?? 0}
      />
      {isLoading && <Loader color="primary" size="large" />}
      <AddVault />
    </MyVaultsWrapper>
  );
};
