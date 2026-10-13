import { MouseEventHandler } from 'react';
import { MaxButton } from './styled';

type InputDecoratorMaxButtonProps = {
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & React.ComponentProps<typeof MaxButton>;

export const InputDecoratorMaxButton = ({
  disabled,
  children,
  ...rest
}: InputDecoratorMaxButtonProps) => {
  return (
    <MaxButton
      size="xxs"
      variant="translucent"
      data-testid="maxBtn"
      disabled={disabled}
      {...rest}
    >
      {children ?? 'MAX'}
    </MaxButton>
  );
};
