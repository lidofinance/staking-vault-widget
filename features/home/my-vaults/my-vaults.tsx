import { VaultTable } from 'features/home/vault-table';
import { ConnectWallet } from 'features/home/connect-wallet';

import { VaultInfo } from 'types';
import { useDappStatus } from 'modules/web3';

const myVaults: VaultInfo[] = [
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

  {
    address: '0xddddE8035D59277f4a44BCf75BeD11E8762c98f4',
    valuation: '1231233123',
    minted: '1231233123',
    mintable: '1231233123',
    APR: null,
    healthScore: '150',
  },
];

export const MyVaults = () => {
  const { address } = useDappStatus();

  return (
    <>
      {!address && <ConnectWallet />}
      {address && <VaultTable title="My Vaults" vaults={myVaults} />}
    </>
  );
};
