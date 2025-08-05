import { MouseEvent, FC } from 'react';

import { Close } from '@lidofinance/lido-ui';
import { Button } from './styles';

export interface CloseButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  dataTestId?: string;
}

export const ButtonClose: FC<CloseButtonProps> = ({ onClick, dataTestId }) => {
  return (
    <Button
      onClick={onClick}
      type="button"
      data-testid={dataTestId ? dataTestId : null}
    >
      <Close />
    </Button>
  );
};
