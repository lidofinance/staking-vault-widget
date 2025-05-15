import { FC } from 'react';
import { GeneralInput, GeneralInputProps } from './general-input';
import { AddressInput } from './address-input';
import { AddressArrayInput } from './address-array-input';

export const InputResolver: FC<GeneralInputProps> = (props) => {
  const { dataType } = props;

  switch (dataType) {
    case 'addressArray':
      return <AddressArrayInput {...props} dataType={dataType} />;
    case 'address':
      return <AddressInput {...props} dataType={dataType} />;
    default:
      return <GeneralInput {...props} />;
  }
};
