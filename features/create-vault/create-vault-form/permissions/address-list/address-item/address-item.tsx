import { FC } from 'react';

import { AddressBadge } from 'shared/components';

export interface AddressItemProps {
  index: number;
  address: string;
  remove: (index: number) => void;
}

export const AddressItem: FC<AddressItemProps> = ({
  index,
  address,
  remove,
}) => {
  return <AddressBadge address={address} onRemove={() => remove(index)} />;
};
