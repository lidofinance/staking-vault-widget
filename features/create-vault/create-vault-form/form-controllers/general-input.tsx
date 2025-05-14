import { FC } from 'react';

import { Input } from '@lidofinance/lido-ui';
import { InputTitle } from './styles';

import {
  CreateVaultSchema,
  InputDataType,
  MainSettingsKeys,
} from 'features/create-vault/types';
import { useFormContext } from 'react-hook-form';

export type GeneralInputProps = {
  name: MainSettingsKeys;
  label?: string;
  type?: string;
  title: string;
  notes?: string;
  dataType?: InputDataType;
  afterText?: string; // TODO: add option for text like 'hours' (confirmExpiry field)
};

export const GeneralInput: FC<GeneralInputProps> = ({
  name,
  label,
  title,
  type,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateVaultSchema>();

  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <Input
        label={label}
        type="text"
        error={errors[name]?.message}
        fullwidth
        {...register(name, {
          valueAsNumber: type === 'number',
        })}
      />
    </div>
  );
};
