import { useRef, forwardRef, useState, ChangeEvent, useCallback } from 'react';
import { UseFormSetValue, FieldValues } from 'react-hook-form';
import { mergeRefs } from 'utils';
import { InputProps } from '@lidofinance/lido-ui';

import { RadioInput, RadioInputProps } from '../radio';

import { InputStyled } from './radio-with-input.styles';

type RadioWithInputProps = Omit<InputProps, 'type'> & {
  radioProps: RadioInputProps;
  setRadioValue: UseFormSetValue<FieldValues>;
  type: string;
};

export const RadioWithInput = forwardRef<HTMLInputElement, RadioWithInputProps>(
  (props, ref) => {
    const { radioProps, setRadioValue, type, ...rest } = props;

    const [value, setValue] = useState<string>('');
    const radioRef = useRef<HTMLInputElement>(null);

    const updateRadioValue = useCallback(
      (value: string) => {
        setRadioValue(type, String(value), {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      },
      [setRadioValue, type],
    );

    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(radioProps.symbol, '');
        setValue(value);
        updateRadioValue(value);
        radioRef.current?.click();
      },
      [radioProps.symbol, updateRadioValue],
    );

    const onClick = useCallback(() => {
      updateRadioValue(value);
      radioRef.current?.click();
    }, [updateRadioValue, value]);

    return (
      <RadioInput
        {...radioProps}
        ref={mergeRefs(ref, radioRef)}
        hasError={!!rest.error}
      >
        <InputStyled
          {...rest}
          value={value}
          onChange={onChange}
          onClick={onClick}
        />
      </RadioInput>
    );
  },
);
