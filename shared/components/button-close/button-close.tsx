import { MouseEvent, FC } from 'react';

import { Close } from '@lidofinance/lido-ui';
import { Button } from './styles';

export interface CloseButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonClose: FC<CloseButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} type="button">
      <Close />
    </Button>
  );
};
