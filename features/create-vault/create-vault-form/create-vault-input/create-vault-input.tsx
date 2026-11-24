import type { FC } from 'react';

import { GeneralInput } from './general-input';
import { AddressInput } from './address-input';
import { AddressArrayInput } from './address-array-input';

import {
  InputContainer,
  InputDescription,
  InputHeader,
  InputTitle,
} from './styles';
import type { MainSettingsEntryType } from 'features/create-vault/types';

const getInput = (dataType: MainSettingsEntryType['dataType']) => {
  switch (dataType) {
    case 'addressArray':
      return AddressArrayInput;
    case 'address':
      return AddressInput;
    default:
      return GeneralInput;
  }
};

export const CreateVaultInput: FC<MainSettingsEntryType> = (props) => {
  const { dataType, title, description, dataTestId } = props;

  const Input = getInput(dataType);

  return (
    <InputContainer
      data-testid={dataTestId ? `${dataTestId}-inputContainer` : undefined}
    >
      {title && (
        <InputHeader>
          <InputTitle
            data-testid={dataTestId ? `${dataTestId}-inputTitle` : undefined}
          >
            {title}
          </InputTitle>
          {description && (
            <InputDescription
              data-testid={
                dataTestId ? `${dataTestId}-inputDescription` : undefined
              }
            >
              {description}
            </InputDescription>
          )}
        </InputHeader>
      )}
      <Input {...props} />
    </InputContainer>
  );
};
