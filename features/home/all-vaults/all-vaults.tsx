import { VaultTable } from 'features/home/vault-table';

import { VaultInfo } from 'types';

const allVaults: VaultInfo[] = [
  {
    address: '0x3725E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 12312331231231233123n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    APR: null,
    healthScore: 1500,
  },
  {
    address: 'ensname.eth',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    APR: null,
    healthScore: 1000,
  },
];

export const AllVaults = () => {
  return <VaultTable title="All Vaults" vaults={allVaults} />;
};
