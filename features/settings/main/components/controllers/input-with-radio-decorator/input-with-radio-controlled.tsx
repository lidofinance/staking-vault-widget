import { FC, useState, useMemo, useId } from 'react';
import { InputProps } from '@lidofinance/lido-ui';
import { InputField, Label, Radio } from './styles';
import { useController } from 'react-hook-form';

export interface InputWithRadioControlledProps
  extends Omit<InputProps, 'value' | 'name'> {
  name: string;
  textFieldName: string;
  value: string | number;
  mask?: string;
  defaultDisabled?: boolean;
}

export const InputWithRadioControlled: FC<InputWithRadioControlledProps> = ({
  name,
  mask,
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
    if (mask && textField.value) {
      return isFocused ? textField.value : `${textField.value}${mask}`;
    }

    return textField.value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [textField.value, mask, isFocused]);

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
          <div>
            <Radio {...radioField} value={value} type="radio" id={id} />
          </div>
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
