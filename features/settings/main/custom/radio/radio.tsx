import { PropsWithChildren, HTMLAttributes, forwardRef } from 'react';

import {
  RadioInputStyled,
  RadioInputLabel,
  RadioInputSelector,
  RightDecorator,
  Chip,
  Content,
} from './radio.styles';

export type RadioInputProps = PropsWithChildren<
  HTMLAttributes<HTMLInputElement>
> & {
  tags?: string[];
  id: string;
  name: string;
  value: string;
  symbol: string;
  hasError?: boolean;
  disabled?: boolean;
};

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  (props, ref) => {
    const { value, tags, children, symbol, hasError, disabled, ...rest } =
      props;
    const valueToDisplay = value ? `${value}${symbol}` : '';

    return (
      <RadioInputLabel
        htmlFor={rest.id}
        hasError={hasError}
        disabled={disabled}
      >
        <RadioInputStyled
          type="radio"
          {...rest}
          value={value}
          ref={ref}
          disabled={disabled}
        />
        <RadioInputSelector />
        {valueToDisplay}
        {children && <Content>{children}</Content>}
        {tags && (
          <RightDecorator>
            {tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </RightDecorator>
        )}
      </RadioInputLabel>
    );
  },
);
