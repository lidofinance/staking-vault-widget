import { FC } from 'react';
import { useRouter } from 'next/router';
import { Address } from 'viem';
import { useEnsName } from 'wagmi';

import { AddressBadge } from 'shared/components/address-badge';
import { AddressWrapper } from './styles';

import { AppPaths } from 'consts/urls';
import { BaseCellProps } from 'features/home/vault-table/types';

export const AddressCell: FC<BaseCellProps<Address>> = ({ value }) => {
  const router = useRouter();
  const { data } = useEnsName({
    address: value,
  });

  const handleClick = () => {
    void router.push(`${AppPaths.overview}/${value}`);
  };

  return (
    <AddressWrapper role="link" onClick={handleClick}>
      <AddressBadge address={data ?? value} />
    </AddressWrapper>
  );
};
