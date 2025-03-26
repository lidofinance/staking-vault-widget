import { FC, PropsWithChildren } from 'react';
import { ChipStyled } from './styles';
import { ChipVariants } from '@lidofinance/lido-ui';

interface ChipProps {
  variant?: ChipVariants;
}

export const Chip: FC<PropsWithChildren<ChipProps>> = ({
  children,
  variant = 'positive' as ChipVariants,
}) => {
  return <ChipStyled variant={variant}>{children}</ChipStyled>;
};
