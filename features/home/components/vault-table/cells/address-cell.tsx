import { FC } from 'react';
import { useRouter } from 'next/router';
import { Address } from 'viem';
import { useEnsName } from 'wagmi';

import { AddressBadge } from 'shared/components/address-badge';
import { AddressWrapper } from './styles';

import { BaseCellProps } from 'features/home/components/vault-table/types';
import { appPaths } from 'consts/routing';

export const AddressCell: FC<BaseCellProps<Address>> = ({ value }) => {
  const router = useRouter();
  const { data } = useEnsName({
    address: value,
  });

  const handleClick = () => {
    void router.push(appPaths.vaults.vault(value).overview);
  };

  return (
    <AddressWrapper role="link" onClick={handleClick}>
      <AddressBadge address={data ?? value} />
    </AddressWrapper>
  );
};
