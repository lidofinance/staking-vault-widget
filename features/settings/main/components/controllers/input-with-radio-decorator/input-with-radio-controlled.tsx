import { FC, useState, useMemo, useId } from 'react';
import { InputProps } from '@lidofinance/lido-ui';
import { useController } from 'react-hook-form';

import { HiddenRadio, InputField, Label, RadioIcon } from './styles';

export type InputWithRadioControlledProps = Omit<
  InputProps,
  'value' | 'name'
> & {
  name: string;
  textFieldName: string;
  value: string | number;
  unitIndicator?: string;
  defaultDisabled?: boolean;
};

export const InputWithRadioControlled: FC<InputWithRadioControlledProps> = ({
  name,
  unitIndicator,
  value,
  disabled,
  defaultChecked = false,
  defaultDisabled = false,
  textFieldName,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const { field: radioField } = useController({ name });
  const {
    field: textField,
    fieldState: { error },
  } = useController({ name: textFieldName });
  const id = useId();

  const displayValue = useMemo(() => {
    if (unitIndicator && textField.value) {
      return isFocused ? textField.value : `${textField.value}${unitIndicator}`;
    }

    return textField.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textField.value, unitIndicator, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <Label htmlFor={id}>
      <InputField
        {...textField}
        value={isFocused ? textField.value : displayValue}
        leftDecorator={
          <RadioIcon>
            <HiddenRadio {...radioField} value={value} type="radio" id={id} />
          </RadioIcon>
        }
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={error?.message}
        $checked={defaultChecked}
        $defaultDisabled={defaultDisabled}
        $invalid={!!error?.message}
        {...rest}
      />
    </Label>
  );
};
