import { FC } from 'react';
import { GeneralInput, GeneralInputProps } from './general-input';
import { AddressInput } from './address-input';

export const InputResolver: FC<GeneralInputProps> = (props) => {
  const { dataType } = props;

  return dataType === 'address' ? (
    <AddressInput {...props} dataType={dataType} />
  ) : (
    <GeneralInput {...props} />
  );
};
