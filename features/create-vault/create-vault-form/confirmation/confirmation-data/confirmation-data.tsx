import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  ConfirmPercent,
  ConfirmAddress,
  ConfirmTime,
  ConfirmDefault,
  ConfirmNumber,
  ConfirmDataItemProps,
} from './confirmation-data-item';

import { validateFormValue } from 'utils/validate-form-value';
import { InputDataType } from 'features/create-vault/types';

export interface ConfirmationDataProps {
  permission: string;
  dataType: InputDataType;
}

const ComponentByType: Record<InputDataType, FC<ConfirmDataItemProps>> = {
  address: ConfirmAddress,
  percent: ConfirmPercent,
  time: ConfirmTime,
  number: ConfirmNumber,
  default: ConfirmDefault,
};

const getComponentByType = (dataType: InputDataType) => {
  const Component = ComponentByType[dataType];
  if (!Component) {
    return ConfirmDefault;
  }

  return Component;
};

export const ConfirmationData: FC<ConfirmationDataProps> = ({
  permission,
  dataType,
}) => {
  const { getValues } = useFormContext();

  const value = getValues(permission);
  if (!validateFormValue(value)) {
    dataType = 'default';
  }

  const DataComponent = getComponentByType(dataType);

  return <DataComponent payload={value} />;
};
