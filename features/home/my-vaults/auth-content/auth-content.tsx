import { VaultTable } from 'features/home/vault-table';
import { AddVault } from 'features/home/my-vaults/add-vault';

import { VaultInfo } from 'types';

const myVaults: VaultInfo[] = [
  {
    address: '0x3725E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    APR: null,
    healthScore: 150,
  },
  {
    address: 'ensname.eth',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    APR: null,
    healthScore: 100,
  },
  {
    address: '0xddddE8035D59277f4a44BCf75BeD11E8762c98f4',
    valuation: 66231231223123123233n,
    minted: 4323123312231233123n,
    mintable: 123123231231232312312n,
    APR: null,
    healthScore: 150,
  },
];

export const AuthContent = () => {
  // TODO: load vault by connected address
  return (
    <>
      <VaultTable title="My Vaults" vaults={myVaults} showTitle />
      <AddVault />
    </>
  );
};
