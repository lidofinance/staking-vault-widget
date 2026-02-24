import type { FC } from 'react';
import { Text, Copy, External, Address } from '@lidofinance/lido-ui';

type ContractAddressProps = {
  title: string;
  address: string;
};

export const ContractAddress: FC<ContractAddressProps> = ({
  title,
  address,
}) => {
  return (
    <div>
      <Text>{title}</Text>
      <div>
        <Address address={address} />
        <Copy />
        <External />
      </div>
    </div>
  );
};
