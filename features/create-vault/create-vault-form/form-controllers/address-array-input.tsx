import { useFieldArray, useFormContext } from 'react-hook-form';
import {
  AddressInputGroup,
  AddressList,
  AppendButton,
  InputTitle,
} from './styles';
import { Address } from 'viem';

import { Plus } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { AddressInputBase } from './address-input-base';

export type AddressArrayProps = {
  name: string;
  label?: string;
  title: string;
  notes?: string;
  dataType?: 'addressArray';
  afterText?: string; // TODO: add option for text like 'hours' (confirmExpiry field)
};

type PlaceholderForm = {
  addresses: { value: Address }[];
};

export const AddressArrayInput = ({
  name,
  title,
  label,
}: AddressArrayProps) => {
  const { register } = useFormContext();
  const { fields, append, remove } = useFieldArray<
    PlaceholderForm,
    'addresses'
  >({ name: name as 'addresses' });
  const allowDelete = fields.length > 1;
  return (
    <AddressList>
      <InputTitle>{title}</InputTitle>
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
