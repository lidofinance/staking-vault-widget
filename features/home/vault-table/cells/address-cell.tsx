import { AddressBadge } from 'shared/components/address-badge';
import { BaseCellProps } from './types';

export const AddressCell = ({ value }: BaseCellProps) => {
  if (typeof value !== 'string') {
    return null;
  }

  return <AddressBadge address={value} />;
};
