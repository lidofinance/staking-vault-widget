import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { InputNotes, InputTitle } from './styles';

import {
  CreateVaultSchema,
  MainSettingsKeys,
} from 'features/create-vault/types';
import { AddressInputBase } from './address-input-base';

export type AddressInputProps = {
  name: MainSettingsKeys;
  label?: string;
  title: string;
  notes?: string;
  dataType: 'address';
  afterText?: string;
};

export const AddressInput: FC<AddressInputProps> = ({
  name,
  label,
  title,
  notes,
}) => {
  const { register } = useFormContext<CreateVaultSchema>();
  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <AddressInputBase {...register(name)} label={label} />
      {!!notes && (
        <InputNotes>
          <b>Note: </b>
          {notes}
        </InputNotes>
      )}
    </div>
  );
};
