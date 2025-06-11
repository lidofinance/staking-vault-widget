import {
  useRef,
  forwardRef,
  useState,
  ChangeEvent,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import { mergeRefs } from 'utils';
import { InputProps } from '@lidofinance/lido-ui';

import { RadioInput, RadioInputProps } from '../radio';

import { InputStyled } from './radio-with-input.styles';

import { formatInputValue } from 'features/settings/main/utils';

type RadioWithInputProps = Omit<InputProps, 'type'> & {
  radioProps: RadioInputProps;
  type: string;
  shouldClearField?: boolean;
};

export const RadioWithInput = forwardRef<HTMLInputElement, RadioWithInputProps>(
  (props, ref) => {
    const { radioProps, shouldClearField, type, error, ...rest } = props;

    const [value, setValue] = useState<string>('');
    const [isFocused, setIsFocused] = useState(false);
    const [isDirty, setDirty] = useState(false);
    const radioRef = useRef<HTMLInputElement>(null);
    const hasError = !!error && isDirty;
    const valueToDisplay =
      formatInputValue(
        value,
        isFocused,
        hasError,
        radioProps.symbol,
        radioProps.format,
      ) || '';

    const displayError = useMemo(() => {
      if (hasError) return error;
      return '';
    }, [error, hasError]);

    const onClick = useCallback(() => {
      radioRef.current?.click();
    }, []);

    const handleFocus = useCallback(() => {
      setIsFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
      setIsFocused(false);
    }, []);

    useEffect(() => {
      if (shouldClearField) {
        setDirty(false);
        setValue('');
      }
    }, [shouldClearField]);

    const onChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        props.onChange?.(e);
        setValue(e.target.value);
        setDirty(true);
      },
      [props],
    );

    return (
      <RadioInput
        {...radioProps}
        ref={mergeRefs(radioProps.ref, radioRef)}
        hasError={hasError}
        value="custom"
        valueToDisplay={valueToDisplay}
      >
        <InputStyled
          {...rest}
          error={displayError}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={onClick}
          onChange={onChange}
          ref={ref}
        />
      </RadioInput>
    );
  },
);
