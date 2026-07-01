import type { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';

import { IconWrapper, WarmingContainer } from './styles';

type WarningInfoProps = PropsWithChildren<{ 'data-testid'?: string }>;

export const WarningInfo: FC<WarningInfoProps> = ({
  children,
  'data-testid': dataTestId,
}) => {
  return (
    <WarmingContainer data-testid={dataTestId}>
      <IconWrapper>
        <WarningRing />
      </IconWrapper>
      <Text size="xxs">{children}</Text>
    </WarmingContainer>
  );
};
