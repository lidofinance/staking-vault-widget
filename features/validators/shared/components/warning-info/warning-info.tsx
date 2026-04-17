import type { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';

import { IconWrapper, WarmingContainer } from './styles';

export const WarningInfo: FC<PropsWithChildren> = ({ children }) => {
  return (
    <WarmingContainer>
      <IconWrapper>
        <WarningRing />
      </IconWrapper>
      <Text size="xxs">{children}</Text>
    </WarmingContainer>
  );
};
