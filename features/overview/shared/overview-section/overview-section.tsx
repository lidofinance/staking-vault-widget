import { FC, PropsWithChildren } from 'react';

import { Section } from './styles';

export const OverviewSection: FC<PropsWithChildren> = ({ children }) => {
  return <Section>{children}</Section>;
};
