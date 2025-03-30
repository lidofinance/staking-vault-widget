import { FC } from 'react';
import { useRouter } from 'next/router';
import { Address } from 'viem';
import { useEnsName } from 'wagmi';

import { AddressBadge } from 'shared/components/address-badge';
import { AddressWrapper } from './styles';

import { AppPaths } from 'consts/urls';
import { BaseCellProps } from 'features/home/vault-table/types';
import { useVaults } from 'providers/vaults';

export const AddressCell: FC<BaseCellProps<Address>> = ({ value }) => {
  const router = useRouter();
  const { setActiveVault } = useVaults();
  const { data } = useEnsName({
    address: value,
  });

  const handleClick = () => {
    setActiveVault(value);
    void router.push(AppPaths.overview);
  };

  return (
    <AddressWrapper role="link" onClick={handleClick}>
      <AddressBadge address={data ?? value} />
    </AddressWrapper>
  );
};
