import type { FC } from 'react';

import { TextInputHookForm } from 'shared/hook-form/controls';

import type { CreateFormInputProps } from './types';

export const GeneralInput: FC<CreateFormInputProps> = ({ name, label }) => {
  return <TextInputHookForm fieldName={name} label={label} />;
};
