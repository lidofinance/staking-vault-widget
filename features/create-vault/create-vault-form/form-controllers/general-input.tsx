import { FC } from 'react';
import { UseFormReturn } from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';
import { InputTitle } from './styles';

import {
  InputDataType,
  VaultMainSettingsType,
  MainSettingsKeys,
} from 'features/create-vault/types';

export interface GeneralInputProps {
  form: UseFormReturn<VaultMainSettingsType>;
  name: MainSettingsKeys;
  label?: string;
  type?: string;
  title: string;
  notes?: string;
  dataType?: InputDataType;
  afterText?: string; // TODO: add option for text like 'hours' (confirmExpiry field)
}

export const GeneralInput: FC<GeneralInputProps> = (props) => {
  const { form, name, label, title, type } = props;
  const { getFieldState, register } = form;
  const { error } = getFieldState(name);

  let inputProps = register(name);
  if (type === 'number') {
    inputProps = register(name, {
      valueAsNumber: true,
    });
  }

  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <Input
        label={label}
        type="text"
        error={error?.message}
        fullwidth
        {...inputProps}
      />
    </div>
  );
};
