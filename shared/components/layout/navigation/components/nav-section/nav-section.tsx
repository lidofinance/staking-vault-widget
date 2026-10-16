import type { FC, PropsWithChildren } from 'react';

import { Section } from './styles';

type NavSectionProps = PropsWithChildren<{
  // space between the divider and the content, px
  contentOffset?: number;
}>;

// desktop-only sidebar section with a divider on top
export const NavSection: FC<NavSectionProps> = ({
  contentOffset,
  children,
}) => {
  return <Section $contentOffset={contentOffset}>{children}</Section>;
};
