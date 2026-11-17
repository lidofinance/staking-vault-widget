import { useFieldArray, useFormContext, useFormState } from 'react-hook-form';
import { Plus } from '@lidofinance/lido-ui';
import type { FC } from 'react';
import type { Address } from 'viem';

import { ButtonClose } from 'shared/components';
import { AddressField } from './address-field';
import { AddressInputGroup, AddressList, AppendButton } from './styles';
import type { CreateFormInputProps } from './types';

type PlaceholderForm = {
  addresses: { value: Address }[];
};

export const AddressArrayInput: FC<CreateFormInputProps> = ({
  name,
  placeholder,
}) => {
  const { disabled } = useFormState();
  const { trigger } = useFormContext();
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
            <AddressField
              placeholder={placeholder}
              fieldName={`${name}.${index}.value` as const}
              deps={name}
            />
            {allowDelete && (
              <ButtonClose
                onClick={() => {
                  remove(index);
                  void trigger(name);
                }}
              />
            )}
          </AddressInputGroup>
        );
      })}
      {!disabled && (
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
      )}
    </AddressList>
  );
};
