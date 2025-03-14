import { FC, useCallback } from 'react';

import { AddressItem } from 'features/create-vault/create-vault-form/permissions/address-item';
import { Wrapper } from './styles';

export interface AddressBlockProps {
  permission: string;
  fields: Record<'id', string>[];
  remove: (index?: number | number[]) => void;
}

export const AddressBlock: FC<AddressBlockProps> = ({
  permission,
  fields,
  remove,
}) => {
  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  return (
    <Wrapper>
      {fields.map(({ id }, index) => {
        return (
          <AddressItem
            key={id}
            permission={permission}
            index={index}
            remove={handleRemove}
          />
        );
      })}
    </Wrapper>
  );
};
