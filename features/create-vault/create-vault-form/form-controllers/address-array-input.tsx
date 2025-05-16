import { useFieldArray, useFormContext } from 'react-hook-form';
import { Plus } from '@lidofinance/lido-ui';

import { ButtonClose } from 'shared/components';
import { AddressInputGroup, AddressList, AppendButton } from './styles';
import { AddressInputBase } from './address-input-base';

import type { MainSettingsEntryType } from 'features/create-vault/types';
import type { FC } from 'react';
import type { Address } from 'viem';

export type AddressArrayProps = MainSettingsEntryType;

type PlaceholderForm = {
  addresses: { value: Address }[];
};

export const AddressArrayInput: FC<AddressArrayProps> = ({ name, label }) => {
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray<
    PlaceholderForm,
    'addresses'
  >({ name: name as 'addresses' });
  const allowDelete = fields.length > 1;
  return (
    <AddressList>
      {fields.map((field, index) => {
        return (
          <AddressInputGroup key={field.id}>
            <AddressInputBase
              key={field.id}
              label={label}
              {...register(`${name}.${index}.value` as const)}
            />
            {allowDelete && <ButtonClose onClick={() => remove(index)} />}
          </AddressInputGroup>
        );
      })}
      <AppendButton
        color="primary"
        icon={<Plus />}
        size="md"
        variant="ghost"
        type="button"
        onClick={() => append({ value: '' as Address })}
      >
        Add new address
      </AppendButton>
    </AddressList>
  );
};
