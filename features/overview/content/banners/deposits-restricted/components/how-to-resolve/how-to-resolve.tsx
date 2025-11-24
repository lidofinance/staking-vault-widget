import type { PropsWithChildren } from 'react';

import { Text } from '@lidofinance/lido-ui';

import { List, Wrapper } from './styles';

export const HowToResolve = ({ children }: PropsWithChildren) => {
  return (
    <Wrapper>
      <Text size="xxs" strong>
        How to resolve:
      </Text>
      <List>{children}</List>
    </Wrapper>
  );
};
