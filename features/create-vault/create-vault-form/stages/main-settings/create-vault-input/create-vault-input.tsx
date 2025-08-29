import type { FC } from 'react';
import { Hint } from 'shared/components';

import { GeneralInput } from './general-input';
import { AddressInput } from './address-input';
import { ConfirmInput } from './confirm-input';
import { AddressArrayInput } from './address-array-input';

import { InputContainer, InputNotes, InputTitle } from './styles';
import type { MainSettingsEntryType } from 'features/create-vault/types';

const getInput = (dataType: MainSettingsEntryType['dataType']) => {
  switch (dataType) {
    case 'addressArray':
      return AddressArrayInput;
    case 'address':
      return AddressInput;
    case 'confirm':
      return ConfirmInput;
    default:
      return GeneralInput;
  }
};

export const CreateVaultInput: FC<MainSettingsEntryType> = (props) => {
  const { dataType, title, notes, hint, dataTestId } = props;

  const Input = getInput(dataType);

  return (
    <InputContainer
      data-testid={dataTestId ? `${dataTestId}-inputContainer` : null}
    >
      {title && (
        <InputTitle
          data-testid={dataTestId ? `${dataTestId}-inputTitle` : null}
        >
          {title}
          <Hint
            text={hint}
            data-testid={dataTestId ? `${dataTestId}-inputHint` : null}
          />
        </InputTitle>
      )}
      <Input {...props} />
      {!!notes && (
        <InputNotes>
          <b>Note: </b>
          {notes}
        </InputNotes>
      )}
    </InputContainer>
  );
};
