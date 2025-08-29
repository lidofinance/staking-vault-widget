import { useFieldArray, useFormState } from 'react-hook-form';
import { Plus } from '@lidofinance/lido-ui';
import type { FC } from 'react';
import type { Address } from 'viem';

import { ButtonClose } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { AddressInputGroup, AddressList, AppendButton } from './styles';
import type { CreateFormInputProps } from './types';

type PlaceholderForm = {
  addresses: { value: Address }[];
};

export const AddressArrayInput: FC<CreateFormInputProps> = ({
  name,
  label,
}) => {
  const { disabled } = useFormState();
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
            <AddressInputHookForm
              key={field.id}
              showRightDecorator={false}
              label={label}
              fieldName={`${name}.${index}.value` as const}
            />
            {allowDelete && <ButtonClose onClick={() => remove(index)} />}
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
