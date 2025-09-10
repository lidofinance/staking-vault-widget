import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Hint } from 'shared/components';

import { ConfirmAddress, ConfirmAddressArray } from './confirm-address';
import { ConfirmNumber } from './confirm-number';
import { ConfirmPercent } from './confirm-percent';
import { ConfirmTime } from './confirm-time';

import { ConfirmationLabel, ListItem } from './styles';

import type {
  InputDataType,
  MainSettingsEntryType,
} from 'features/create-vault/types';

export type ConfirmationDataProps = MainSettingsEntryType;

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
      null;
  }
};

export const ConfirmationEntry: FC<ConfirmationDataProps> = ({
  name,
  dataType,
  title,
  hint,
  dataTestId,
}) => {
  const { getValues } = useFormContext();
  const value = getValues(name);
  const DataComponent = getComponentByType(dataType);

  // For some inputs we don't need confirmation e.g. terms checkbox
  if (!DataComponent) return null;

  return (
    <ListItem
      key={name}
      data-testid={dataTestId ? `${dataTestId}-listItem` : undefined}
    >
      <ConfirmationLabel
        data-testid={dataTestId ? `${dataTestId}-label` : undefined}
      >
        {title}{' '}
        <Hint
          text={hint}
          data-testid={dataTestId ? `${dataTestId}-hint` : undefined}
        />
      </ConfirmationLabel>
      <DataComponent payload={value} dataTestId={dataTestId} />
    </ListItem>
  );
};
