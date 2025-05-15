import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  ConfirmPercent,
  ConfirmAddress,
  ConfirmTime,
  ConfirmNumber,
  ConfirmAddressArray,
} from './confirmation-data-item';

import { InputDataType } from 'features/create-vault/types';
import invariant from 'tiny-invariant';

export type ConfirmationDataProps = {
  name: string;
  dataType: InputDataType;
};

const getComponentByType = (dataType: InputDataType) => {
  switch (dataType) {
    case 'address':
      return ConfirmAddress;
    case 'addressArray':
      return ConfirmAddressArray;
    case 'percent':
      return ConfirmPercent;
    case 'time':
      return ConfirmTime;
    case 'number':
      return ConfirmNumber;
    default:
      invariant(false, `Unknown dataType: ${dataType}`);
  }
};

export const ConfirmationData: FC<ConfirmationDataProps> = ({
  name,
  dataType,
}) => {
  const { getValues } = useFormContext();
  const value = getValues(name);
  const DataComponent = getComponentByType(dataType);

  return <DataComponent payload={value} />;
};
