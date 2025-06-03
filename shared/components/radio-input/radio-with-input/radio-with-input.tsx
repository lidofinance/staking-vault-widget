import { useRef, forwardRef, useState, ChangeEvent, useCallback } from 'react';
import { UseFormSetValue, FieldValues } from 'react-hook-form';
import { mergeRefs } from 'utils';
import { InputProps } from '@lidofinance/lido-ui';

import { RadioInput, RadioInputProps } from '../radio';

import { InputStyled } from './radio-with-input.styles';

import { formatInputValue } from 'features/settings/main/utils';

type RadioWithInputProps = Omit<InputProps, 'type'> & {
  radioProps: RadioInputProps;
  setRadioValue: UseFormSetValue<FieldValues>;
  type: string;
};

export const RadioWithInput = forwardRef<HTMLInputElement, RadioWithInputProps>(
  (props, ref) => {
    const { radioProps, setRadioValue, type, ...rest } = props;

    const [value, setValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const radioRef = useRef<HTMLInputElement>(null);

    const displayValue = formatInputValue(value, radioProps.symbol, isFocused);

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

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    return (
      <RadioInput
        {...radioProps}
        ref={mergeRefs(ref, radioRef)}
        hasError={!!rest.error}
      >
        <InputStyled
          {...rest}
          value={displayValue}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={onClick}
        />
      </RadioInput>
    );
  },
);
