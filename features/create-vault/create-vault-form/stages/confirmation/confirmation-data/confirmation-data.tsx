import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import invariant from 'tiny-invariant';

import { ConfirmAddress, ConfirmAddressArray } from './confirm-address';
import { ConfirmNumber } from './confirm-number';
import { ConfirmPercent } from './confirm-percent';
import { ConfirmTime } from './confirm-time';

import type { InputDataType } from 'features/create-vault/types';

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
