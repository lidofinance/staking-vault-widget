import {
  useRef,
  forwardRef,
  useState,
  ChangeEvent,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
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
  shouldClearField?: boolean;
};

export const RadioWithInput = forwardRef<HTMLInputElement, RadioWithInputProps>(
  (props, ref) => {
    const {
      radioProps,
      setRadioValue,
      shouldClearField,
      type,
      error,
      ...rest
    } = props;

    const [value, setValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const [isDirty, setDirty] = useState(false);
    const radioRef = useRef<HTMLInputElement>(null);
    const hasError = !!error && isDirty;
    const displayValue = formatInputValue(
      value,
      radioProps.symbol,
      isFocused,
      hasError,
    );

    const displayError = useMemo(() => {
      if (hasError) return error;
      return '';
    }, [error, hasError]);

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
        if (!isDirty) {
          setDirty(true);
        }

        const value = e.target.value.replace(radioProps.symbol, '');
        setValue(value);
        updateRadioValue(value);
        radioRef.current?.click();
      },
      [radioProps.symbol, updateRadioValue, isDirty],
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

    useEffect(() => {
      if (shouldClearField) {
        setValue('');
        setDirty(false);
      }
    }, [shouldClearField]);

    return (
      <RadioInput
        {...radioProps}
        ref={mergeRefs(ref, radioRef)}
        hasError={hasError}
      >
        <InputStyled
          {...rest}
          value={displayValue}
          error={displayError}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={onClick}
        />
      </RadioInput>
    );
  },
);
