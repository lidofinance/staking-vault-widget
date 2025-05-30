import { FC, useMemo, useId } from 'react';
import { InputProps } from '@lidofinance/lido-ui';
import { HiddenRadio, InputField, Label, RadioIcon } from './styles';
import { useController, useFormContext } from 'react-hook-form';

export type InputWithRadioProps = Omit<InputProps, 'value' | 'name'> & {
  name: string;
  value: string | number;
  unitIndicator?: string;
  defaultDisabled?: boolean;
};

export const InputWithRadioDecorator: FC<InputWithRadioProps> = ({
  name,
  unitIndicator,
  value,
  rightDecorator,
  onFocus,
  onBlur,
  onClick,
  disabled,
  defaultChecked = false,
  defaultDisabled = false,
  ...rest
}) => {
  const { watch } = useFormContext();
  const { field: radioField } = useController({ name });
  const id = useId();
  const currentValue = watch(name);

  const displayValue = useMemo(() => {
    if (unitIndicator) {
      return `${value}${unitIndicator}`;
    }

    return value;
  }, [value, unitIndicator]);

  if (!currentValue) {
    return null;
  }

  return (
    <Label htmlFor={id}>
      <InputField
        defaultValue={displayValue}
        leftDecorator={
          <RadioIcon>
            <HiddenRadio
              {...radioField}
              value={value}
              type="radio"
              id={id}
              defaultChecked={Number(currentValue) === value}
            />
          </RadioIcon>
        }
        rightDecorator={rightDecorator}
        $checked={defaultChecked}
        $defaultDisabled={defaultDisabled}
        {...rest}
      />
    </Label>
  );
};
