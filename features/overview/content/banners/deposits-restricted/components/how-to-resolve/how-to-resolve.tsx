import type { PropsWithChildren } from 'react';

import { List, Wrapper } from './styles';
import { TextStyled } from '../../../styles';

export const HowToResolve = ({ children }: PropsWithChildren) => {
  return (
    <Wrapper>
      <TextStyled size="xxs" strong>
        How to resolve:
      </TextStyled>
      <List>{children}</List>
    </Wrapper>
  );
};
