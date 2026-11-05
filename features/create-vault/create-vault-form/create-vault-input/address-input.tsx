import type { FC } from 'react';

import { AddressInputHookForm } from 'shared/hook-form/controls';

import type { CreateFormInputProps } from './types';

export const AddressInput: FC<CreateFormInputProps> = ({
  name,
  placeholder,
}) => {
  return (
    <AddressInputHookForm
      showRightDecorator={false}
      fieldName={name}
      placeholder={placeholder}
    />
  );
};
