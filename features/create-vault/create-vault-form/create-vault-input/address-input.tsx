import type { FC } from 'react';

import { AddressField } from './address-field';
import type { CreateFormInputProps } from './types';

export const AddressInput: FC<CreateFormInputProps> = ({
  name,
  placeholder,
}) => {
  return <AddressField fieldName={name} placeholder={placeholder} />;
};
