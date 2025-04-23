import { FC } from 'react';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';

import { Plus } from '@lidofinance/lido-ui';
import { InputItem } from './input-item';
import { AddAddress } from '../styles';
import { InputBlockWrapper } from './styles';

import { validatePermissions } from 'features/settings/permissions/validation';

import type {
  VaultPermissions,
  PermissionsKeys,
} from 'features/settings/permissions/types';

export interface InputBlockProps {
  permission: PermissionsKeys;
}

export const InputBlock: FC<InputBlockProps> = ({ permission }) => {
  const { getValues } = useFormContext();

  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = useForm<VaultPermissions>({
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
