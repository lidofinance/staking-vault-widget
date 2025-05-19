import { Hint } from 'features/create-vault/shared/hint';

import { GeneralInput, GeneralInputProps } from './general-input';
import { AddressInput } from './address-input';
import { AddressArrayInput } from './address-array-input';

import { InputContainer, InputNotes, InputTitle } from './styles';

import type { FC } from 'react';

const getInput = (dataType: GeneralInputProps['dataType']) => {
  switch (dataType) {
    case 'addressArray':
      return AddressArrayInput;
    case 'address':
      return AddressInput;
    default:
      return GeneralInput;
  }
};

export const CreateVaultInput: FC<GeneralInputProps> = (props) => {
  const { dataType, title, notes, hint } = props;

  const Input = getInput(dataType);

  return (
    <InputContainer>
      <InputTitle>
        {title}
        <Hint hint={hint} />
      </InputTitle>
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
