import { VaultTable } from 'features/home/vault-table';
import { AddVault } from 'features/home/my-vaults/add-vault';

import { VaultInfo } from 'types';

const myVaults: VaultInfo[] = [
  {
    address: '0x3725E8035D59277f4a44BCf75BeD11E8762c98d9',
    valuation: 231233123n,
    minted: 1233123n,
    mintable: 1231233123n,
    APR: null,
    healthScore: 150,
  },
  {
    address: 'ensname.eth',
    valuation: 312123n,
    minted: 123123n,
    mintable: 1231233123n,
    APR: null,
    healthScore: 100,
  },
  {
    address: '0xddddE8035D59277f4a44BCf75BeD11E8762c98f4',
    valuation: 1233123n,
    minted: 123123n,
    mintable: 1231233123n,
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
