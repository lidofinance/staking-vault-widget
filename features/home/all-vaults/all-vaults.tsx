import { useState, useEffect } from 'react';

import { VaultTable } from 'features/home/vault-table';
import { Loader, Pagination } from '@lidofinance/lido-ui';
import { AllVaultsWrapper } from './styles';

import { useVaultData } from 'shared/hooks/use-vault-data';

import { VaultInfo } from 'types';

const allVaults: VaultInfo[] = [
  {
    address: '0x3725E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 12312331231231233123n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    apr: null,
    healthScore: 1.5,
  },
  {
    address: '0xfd25E8035D59255f4a44BCf75BeD11E8762c98d9',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    apr: null,
    healthScore: 1,
  },
  {
    address: '0x4525E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    apr: null,
    healthScore: 0.7,
  },
  {
    address: '0x45525E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    apr: null,
    healthScore: 0.7,
  },
  {
    address: '0xed25E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    apr: null,
    healthScore: 0.7,
  },
];

export const AllVaults = () => {
  const { vaultsData, isLoading } = useVaultData();
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
    const newSlice = allVaults.slice(newCurrentIndex, index * 4);
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
