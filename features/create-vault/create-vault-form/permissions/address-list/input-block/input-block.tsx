import { FC } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';

import { Plus } from '@lidofinance/lido-ui';
import { InputItem } from './input-item';
import { AddAddress } from '../styles';
import { InputBlockWrapper } from './styles';

import { validatePermissions } from 'features/create-vault/create-vault-form/create-vault-form-context/validation';

import {
  PermissionKeys,
  VaultPermissionsType,
} from 'features/create-vault/types';

export interface InputBlockProps {
  permission: PermissionKeys;
}

export const InputBlock: FC<InputBlockProps> = ({ permission }) => {
  const { getValues } = useFormContext();

  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = useForm<VaultPermissionsType>({
    defaultValues: {
      [permission]: [],
    },
    resolver: validatePermissions(getValues),
    mode: 'onBlur',
  });

  const { append, fields, remove } = useFieldArray({
    name: permission,
    control,
  });

  const inputError = errors[permission];

  return (
    <InputBlockWrapper>
      {fields.map((field, index) => (
        <InputItem
          error={inputError?.[index]}
          remove={remove}
          trigger={trigger}
          register={register}
          key={field.id}
          permission={permission}
          index={index}
        />
      ))}

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
    </InputBlockWrapper>
  );
};
