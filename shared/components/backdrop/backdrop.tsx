import { FC, PropsWithChildren } from 'react';

import { BackdropContainer } from './styles';

interface BackdropProps {
  open: boolean;
  className?: string;
}

export const Backdrop: FC<PropsWithChildren<BackdropProps>> = ({
  open = false,
  className = '',
  children,
}) => {
  if (!open) {
    return null;
  }

  return (
    <BackdropContainer className={className}>{children}</BackdropContainer>
  );
};
