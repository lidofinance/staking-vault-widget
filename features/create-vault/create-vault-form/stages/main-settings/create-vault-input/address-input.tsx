import { useFormContext } from 'react-hook-form';

import { AddressInputBase } from './address-input-base';

import type { FC } from 'react';
import type {
  CreateVaultSchema,
  MainSettingsEntryType,
} from 'features/create-vault/types';

export type AddressInputProps = MainSettingsEntryType;

export const AddressInput: FC<AddressInputProps> = ({
  name,
  label,
  dataTestId,
}) => {
  const { register } = useFormContext<CreateVaultSchema>();
  return (
    <AddressInputBase
      {...register(name)}
      label={label}
      dataTestId={dataTestId}
    />
  );
};
