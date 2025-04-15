import { MouseEvent, FC, PropsWithChildren } from 'react';

import { Button } from './styles';

export interface CloseButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonLink: FC<PropsWithChildren<CloseButtonProps>> = ({
  onClick,
  children,
}) => {
  return (
    <Button onClick={onClick} type="button">
      {children}
    </Button>
  );
};
