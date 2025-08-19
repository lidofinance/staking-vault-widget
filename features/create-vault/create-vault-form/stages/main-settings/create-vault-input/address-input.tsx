import type { FC } from 'react';

import { AddressInputHookForm } from 'shared/hook-form/controls';

import type { CreateFormInputProps } from './types';

export const AddressInput: FC<CreateFormInputProps> = ({ name, label }) => {
  return (
    <AddressInputHookForm
      showRightDecorator={false}
      fieldName={name}
      label={label}
    />
  );
};
