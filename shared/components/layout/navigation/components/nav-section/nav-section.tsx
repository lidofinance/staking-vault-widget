import type { FC, PropsWithChildren } from 'react';

import { Section } from './styles';

// desktop-only sidebar section with a divider on top
export const NavSection: FC<PropsWithChildren> = ({ children }) => {
  return <Section>{children}</Section>;
};
