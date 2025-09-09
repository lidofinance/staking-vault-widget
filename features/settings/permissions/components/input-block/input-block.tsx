import { FC, FocusEvent, KeyboardEvent, useState } from 'react';
import { Input, Plus } from '@lidofinance/lido-ui';
import { UseFieldArrayAppend } from 'react-hook-form';

import {
  EditPermissionsSchema,
  FieldSchema,
} from 'features/settings/permissions/types';
import { ButtonClose } from 'shared/components';
import { InputBlockWrapper, AddAddress } from './styles';
import { useAddressValidation } from 'features/settings/permissions/hooks/validate-address';

export type InputBlockProps = {
  fields: (Record<'id', string> & FieldSchema)[];
  append: UseFieldArrayAppend<EditPermissionsSchema>;
  readonly?: boolean;
  dataTestId?: string;
};

export const InputBlock: FC<InputBlockProps> = ({
  fields,
  append,
  readonly,
  dataTestId,
}) => {
  const { inputError, resetError, validateInputValue } =
    useAddressValidation(fields);
  const [showInput, setInputVisibility] = useState(false);

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

    append({ account: value, action: 'grant' });
    hideInputField();
  };

  const hideInputField = () => {
    setInputVisibility(false);
    resetError();
  };

  return (
    <InputBlockWrapper
      data-testid={dataTestId ? `${dataTestId}-inputBlockWrapper` : null}
    >
      {!readonly && showInput && (
        <>
          <Input
            placeholder="Ethereum address"
            type="text"
            autoComplete="off"
            error={inputError}
            onKeyDown={handleInputEvent}
            onBlur={handleInputEvent}
            autoFocus
            data-testid={dataTestId ? `${dataTestId}-addAddressInput` : null}
          />

          <ButtonClose
            onClick={hideInputField}
            dataTestId={`${dataTestId}-addAddressInput-closeButton`}
          />
        </>
      )}

      {!readonly && !showInput && (
        <AddAddress
          color="primary"
          icon={<Plus />}
          size="md"
          variant="ghost"
          type="button"
          onClick={() => setInputVisibility(true)}
          data-testid={dataTestId ? `${dataTestId}-addNewAddressButton` : null}
        >
          Add new address
        </AddAddress>
      )}
    </InputBlockWrapper>
  );
};
