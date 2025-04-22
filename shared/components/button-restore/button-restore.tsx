import { MouseEvent, FC } from 'react';

import { ReactComponent as RestoreIcon } from 'assets/icons/restore.svg';
import { Button } from './styles';

export interface RestoreButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ButtonRestore: FC<RestoreButtonProps> = ({ onClick }) => {
  return (
    <Button onClick={onClick} type="button">
      <RestoreIcon />
    </Button>
  );
};
