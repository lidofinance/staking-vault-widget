import type { FC, PropsWithChildren } from 'react';

import { Container } from './styles';

export const Section: FC<PropsWithChildren> = ({ children }) => {
  return <Container>{children}</Container>;
};
