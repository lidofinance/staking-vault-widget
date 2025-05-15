import { FC, useState } from 'react';

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
  const [inFocus, setInFocus] = useState(false);

  const {
    register,
    formState: { errors },
  } = useFormContext<CreateVaultSchema>();

  const error = errors[name];
  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <Input
        label={label}
        type="text"
        error={inFocus ? error?.message : Boolean(error?.message)}
        fullwidth
        onFocus={() => {
          setInFocus(true);
        }}
        {...register(name, {
          onBlur: () => {
            setInFocus(false);
          },
          valueAsNumber: type === 'number',
        })}
      />
    </div>
  );
};
