import type { FC, PropsWithChildren } from 'react';

import { Container } from './styles';

type SectionProps = PropsWithChildren<{ 'data-testid'?: string }>;

export const Section: FC<SectionProps> = ({
  children,
  'data-testid': dataTestId,
}) => {
  return <Container data-testid={dataTestId}>{children}</Container>;
};
