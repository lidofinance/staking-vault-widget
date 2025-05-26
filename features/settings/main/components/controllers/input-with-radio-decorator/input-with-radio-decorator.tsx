import { FC, FocusEvent, useState, useMemo, useId } from 'react';
import { InputProps } from '@lidofinance/lido-ui';
import { InputField, Label, Radio } from './styles';
import { useController } from 'react-hook-form';

export interface InputWithRadioProps
  extends Omit<InputProps, 'value' | 'name'> {
  name: string;
  radioName: string;
  value?: string | bigint;
  mask?: string;
  index: number;
  defaultDisabled?: boolean;
}

export const InputWithRadioDecorator: FC<InputWithRadioProps> = ({
  name,
  radioName,
  mask,
  rightDecorator,
  onFocus,
  onBlur,
  onChange,
  onClick,
  index,
  disabled,
  defaultChecked = false,
  defaultDisabled = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const {
    field: inputField,
    fieldState: { error, invalid },
  } = useController({ name });
  const { field: checkboxField } = useController({ name: radioName });
  const id = useId();

  const displayValue = useMemo(() => {
    const { value } = inputField;

    if (mask && value) {
      return isFocused ? value : `${value}${mask}`;
    }

    return value;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputField.value, mask, isFocused]);

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = () => {
    setIsFocused(false);
    inputField.onBlur?.();
  };

  return (
    <Label htmlFor={id}>
      <InputField
        {...inputField}
        value={displayValue}
        leftDecorator={
          <div>
            <Radio
              {...checkboxField}
              value={index}
              type="radio"
              id={id}
              defaultChecked={defaultChecked}
            />
          </div>
        }
        rightDecorator={rightDecorator}
        onClick={onClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={error?.message}
        $checked={defaultChecked}
        $defaultDisabled={defaultDisabled}
        $invalid={invalid}
        {...rest}
      />
    </Label>
  );
};
