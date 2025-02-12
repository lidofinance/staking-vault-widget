import { VaultTable } from 'features/home/vault-table';

import { VaultInfo } from 'types';

const allVaults: VaultInfo[] = [
  {
    address: '0x3725E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: '1231233123',
    minted: '1231233123',
    mintable: '1231233123',
    APR: null,
    healthScore: '150',
  },
  {
    address: 'ensname.eth',
    valuation: '1231233123',
    minted: '1231233123',
    mintable: '1231233123',
    APR: null,
    healthScore: '100',
  },
];

export const AllVaults = () => {
  return <VaultTable title="All Vaults" vaults={allVaults} />;
};
