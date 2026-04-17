import type { FC, PropsWithChildren } from 'react';
import { ButtonProps } from '@lidofinance/lido-ui';

import { ButtonStyled } from './styles';

export const ModalFormButton: FC<PropsWithChildren<ButtonProps>> = ({
  children,
  ...rest
}) => {
  return <ButtonStyled {...rest}>{children}</ButtonStyled>;
};
