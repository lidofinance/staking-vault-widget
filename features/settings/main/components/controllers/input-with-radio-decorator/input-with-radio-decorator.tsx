import { FC, useMemo, useId } from 'react';
import { InputProps } from '@lidofinance/lido-ui';
import { InputField, Label, Radio } from './styles';
import { useController, useFormContext } from 'react-hook-form';

export interface InputWithRadioProps
  extends Omit<InputProps, 'value' | 'name'> {
  name: string;
  value: string | number;
  mask?: string;
  defaultDisabled?: boolean;
}

export const InputWithRadioDecorator: FC<InputWithRadioProps> = ({
  name,
  mask,
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
    if (mask) {
      return `${value}${mask}`;
    }

    return value;
  }, [value, mask]);

  return (
    <Label htmlFor={id}>
      <InputField
        defaultValue={displayValue}
        leftDecorator={
          <div>
            <Radio
              {...radioField}
              value={value}
              type="radio"
              id={id}
              checked={Number(currentValue) === value}
            />
          </div>
        }
        rightDecorator={rightDecorator}
        $checked={defaultChecked}
        $defaultDisabled={defaultDisabled}
        {...rest}
      />
    </Label>
  );
};
