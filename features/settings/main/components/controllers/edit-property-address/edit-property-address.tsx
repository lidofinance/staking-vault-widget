import { FC, FocusEvent, KeyboardEvent, useState } from 'react';
import { UseFieldArrayAppend, useFormContext } from 'react-hook-form';
import { Input, Plus } from '@lidofinance/lido-ui';

import { ButtonClose } from 'shared/components';

import { useAddressValidation } from 'features/settings/main/hooks';

import { ButtonContainer, EditWrapper } from './styles';

import {
  MainSettingsFormValidatedValues,
  ManagersKeys,
  RoleFieldSchema,
} from 'features/settings/main/types';

type EditPropertyAddressProps = {
  name: ManagersKeys;
  editLabel: string;
  fields: (Record<'id', string> & RoleFieldSchema)[];
  append: UseFieldArrayAppend<MainSettingsFormValidatedValues>;
};

export const EditPropertyAddress: FC<EditPropertyAddressProps> = ({
  name,
  editLabel,
  fields,
  append,
}) => {
  const [showInput, setInputVisibility] = useState(false);
  const {
    formState: { isLoading },
  } = useFormContext();

  const { inputError, resetError, validateInputValue } =
    useAddressValidation(fields);

  const handleInputEvent = (
    e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>,
  ) => {
    const isEnterKey = e.type === 'keydown' && 'key' in e && e.key === 'Enter';
    const isBlur = e.type === 'blur';

    if (!isEnterKey && !isBlur) return;

    const value = e.currentTarget.value.trim();
    if (!validateInputValue(value)) return;

    if (isEnterKey) {
      e.stopPropagation();
      e.preventDefault();
    }

    append({ value, state: 'grant' });
    hideInputField();
  };

  const hideInputField = () => {
    setInputVisibility(false);
    resetError();
  };

  return (
    <EditWrapper>
      {showInput && (
        <>
          <Input
            name={name}
            label={editLabel}
            onKeyDown={handleInputEvent}
            onBlur={handleInputEvent}
            error={inputError}
            autoFocus
          />
          <ButtonClose onClick={hideInputField} />
        </>
      )}
      {!showInput && !isLoading && (
        <ButtonContainer
          color="primary"
          icon={<Plus />}
          size="md"
          variant="ghost"
          type="button"
          onClick={() => setInputVisibility(true)}
        >
          Add new address
        </ButtonContainer>
      )}
    </EditWrapper>
  );
};
