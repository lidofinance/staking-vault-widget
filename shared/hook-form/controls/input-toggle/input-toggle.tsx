import { useId, type FC } from 'react';
import { Text, TextProps } from '@lidofinance/lido-ui';
import { useController } from 'react-hook-form';

import { Container, InputWrapper, ToggleLoader, ToggleSize } from './styles';

export type InputToggleProps = {
  name: string;
  disabled?: boolean;
  showText?: boolean;
  textOn?: string;
  textOff?: string;
  textPosition?: 'left' | 'right';
  textColor?: TextProps['color'];
  textStrong?: TextProps['strong'];
  size?: ToggleSize;
  className?: string;
  'data-testid'?: string;
};

export const InputToggle: FC<InputToggleProps> = ({
  name,
  disabled,
  showText = false,
  textPosition = 'left',
  textColor = 'secondary',
  textStrong = true,
  textOff,
  textOn,
  size = 'md',
  className,
  'data-testid': dataTestId,
}) => {
  const id = useId();
  const {
    field,
    formState: { isLoading },
  } = useController({ name });

  if (isLoading) {
    return <ToggleLoader />;
  }

  return (
    <Container
      className={className}
      $position={textPosition}
      data-testid={dataTestId}
    >
      {showText && (
        <Text size="xxs" color={textColor} strong={textStrong}>
          {field.value ? textOn : textOff}
        </Text>
      )}

      <InputWrapper $disabled={disabled} $size={size} htmlFor={id}>
        <input
          type="checkbox"
          id={id}
          disabled={disabled}
          checked={field.value}
          {...field}
        />
      </InputWrapper>
    </Container>
  );
};
