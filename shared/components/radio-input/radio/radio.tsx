import { PropsWithChildren, HTMLAttributes, forwardRef, Ref } from 'react';

import {
  RadioInputStyled,
  RadioInputLabel,
  RadioInputSelector,
  RightDecorator,
  Chip,
  Content,
} from './radio.styles';

import { formatValueView } from 'features/settings/main/utils';

export type RadioInputProps = PropsWithChildren<
  HTMLAttributes<HTMLInputElement>
> & {
  tags?: string[];
  id: string;
  name: string;
  value: string;
  symbol?: string;
  format?: (arg: string) => string;
  hasError?: boolean;
  disabled?: boolean;
  ref?: Ref<HTMLInputElement>;
  valueToDisplay?: string;
  dataTestId?: string;
};

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  (props, ref) => {
    const {
      value,
      tags,
      children,
      format,
      symbol,
      hasError,
      disabled,
      dataTestId,
      ...rest
    } = props;
    const valueToDisplay =
      rest.valueToDisplay || formatValueView(value, symbol, format);

    return (
      <RadioInputLabel
        htmlFor={rest.id}
        hasError={hasError}
        disabled={disabled}
        data-testid={dataTestId ? `${dataTestId}-radioInputLabel` : undefined}
      >
        <RadioInputStyled
          type="radio"
          {...rest}
          value={value}
          ref={ref}
          disabled={disabled}
          data-testid={dataTestId ? `${dataTestId}-radioInput` : undefined}
        />
        <RadioInputSelector
          data-testid={
            dataTestId ? `${dataTestId}-radioInputSelector` : undefined
          }
        />
        {valueToDisplay}
        {children && <Content>{children}</Content>}
        {tags && (
          <RightDecorator
            data-testid={
              dataTestId ? `${dataTestId}-radioInputTagsWrapper` : null
            }
          >
            {tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </RightDecorator>
        )}
      </RadioInputLabel>
    );
  },
);
