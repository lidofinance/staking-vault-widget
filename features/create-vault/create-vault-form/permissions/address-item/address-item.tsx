import { FC } from 'react';

import { useFormContext } from 'react-hook-form';
import { AddressBadge } from 'shared/components';

export interface AddressItemProps {
  index: number;
  permission: string;
  remove: (index: number) => void;
}

export const AddressItem: FC<AddressItemProps> = ({
  index,
  permission,
  remove,
}) => {
  const field = `${permission}.${index}.value`;
  const { getFieldState, watch } = useFormContext();
  const fieldAddress = watch(field);
  const { invalid } = getFieldState(field);

  if (!fieldAddress || invalid) {
    return null;
  }

  return <AddressBadge address={fieldAddress} onRemove={() => remove(index)} />;
};
