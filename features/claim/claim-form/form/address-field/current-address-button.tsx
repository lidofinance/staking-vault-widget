import { MouseEventHandler } from 'react';
import { Button } from '@lidofinance/lido-ui';

type InputDecoratorMaxButtonProps = {
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const CurrentAddressButton = ({
  disabled,
  onClick,
}: InputDecoratorMaxButtonProps) => {
  return (
    <Button
      size="xxs"
      variant="translucent"
      onClick={onClick}
      disabled={disabled}
    >
      Current address
    </Button>
  );
};
