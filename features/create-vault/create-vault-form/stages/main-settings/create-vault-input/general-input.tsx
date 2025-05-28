import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@lidofinance/lido-ui';

import type {
  CreateVaultSchema,
  MainSettingsEntryType,
} from 'features/create-vault/types';

export type GeneralInputProps = MainSettingsEntryType;

export const GeneralInput: FC<GeneralInputProps> = ({ name, label }) => {
  const [inFocus, setInFocus] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext<CreateVaultSchema>();

  const error = errors[name];

  return (
    <Input
      label={label}
      type="text"
      error={inFocus ? error?.message?.toString() : Boolean(error?.message)}
      fullwidth
      onFocus={() => {
        setInFocus(true);
      }}
      {...register(name, {
        onBlur: () => {
          setInFocus(false);
        },
      })}
    />
  );
};
