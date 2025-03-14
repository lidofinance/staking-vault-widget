import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Plus } from '@lidofinance/lido-ui';
import { AddressBlock } from 'features/create-vault/create-vault-form/permissions/address-block';
import { InputBlock } from 'features/create-vault/create-vault-form/permissions/input-block';
import { AddAddress, AddressListWrapper } from './styles';

export interface AddressListProps {
  permission: string;
}

export const AddressList: FC<AddressListProps> = ({ permission }) => {
  const { control } = useFormContext();
  const { append, fields, remove } = useFieldArray({
    name: permission,
    control,
  });

  return (
    <AddressListWrapper>
      <AddressBlock permission={permission} fields={fields} remove={remove} />
      <InputBlock permission={permission} fields={fields} remove={remove} />
      <AddAddress
        color="primary"
        icon={<Plus />}
        size="md"
        variant="ghost"
        type="button"
        onClick={() => append({ value: '' })}
      >
        Add new address
      </AddAddress>
    </AddressListWrapper>
  );
};
