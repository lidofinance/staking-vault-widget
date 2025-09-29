import { useId, type FC } from 'react';
import { Text } from '@lidofinance/lido-ui';
import { useController } from 'react-hook-form';

import { Container, InputWrapper } from './styles';

export type InputToggleProps = {
  name: string;
  disabled?: boolean;
  showText?: boolean;
  textOn?: string;
  textOff?: string;
  textPosition?: 'left' | 'right';
  className?: string;
};

export const InputToggle: FC<InputToggleProps> = ({
  name,
  disabled,
  showText = false,
  textPosition = 'left',
  textOff,
  textOn,
  className,
}) => {
  const id = useId();
  const {
    field,
    formState: { isLoading },
  } = useController({ name });

  if (isLoading) {
    return null;
  }

  return (
    <Container className={className} $position={textPosition}>
      {showText && (
        <Text size="xxs" color="secondary" strong>
          {field.value ? textOn : textOff}
        </Text>
      )}

      <InputWrapper $disabled={disabled} htmlFor={id}>
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
