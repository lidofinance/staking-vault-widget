import type { FC } from 'react';

import { TextInputHookForm } from 'shared/hook-form/controls';

import type { CreateFormInputProps } from './types';

export const GeneralInput: FC<CreateFormInputProps> = ({
  name,
  placeholder,
}) => {
  return <TextInputHookForm fieldName={name} placeholder={placeholder} />;
};
