import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  ConfirmPercent,
  ConfirmAddress,
  ConfirmTime,
  ConfirmDefault,
  ConfirmDataItemProps,
} from './confirmation-data-item';

import { validateFormValue } from 'utils/validate-form-value';
import { InputDataType } from 'features/create-vault/types';

export interface ConfirmationDataProps {
  permission: string;
  type: InputDataType;
}

const ComponentByType: Record<InputDataType, FC<ConfirmDataItemProps>> = {
  address: ConfirmAddress,
  percent: ConfirmPercent,
  time: ConfirmTime,
  default: ConfirmDefault,
};

const getComponentByType = (type: InputDataType) => {
  const Component = ComponentByType[type];
  if (!Component) {
    return ConfirmDefault;
  }

  return Component;
};

export const ConfirmationData: FC<ConfirmationDataProps> = ({
  permission,
  type,
}) => {
  const { getValues } = useFormContext();

  const value = getValues(permission);
  if (!validateFormValue(value)) {
    type = 'default';
  }

  const DataComponent = getComponentByType(type);

  return <DataComponent payload={value} />;
};
