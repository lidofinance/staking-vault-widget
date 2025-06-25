import { FC, PropsWithChildren, ReactNode } from 'react';

import { Section } from './styles';

export interface OverviewSectionProps {
  title?: string;
  titleTooltip?: string;
  titleContent?: ReactNode;
}

export const OverviewSection: FC<PropsWithChildren<OverviewSectionProps>> = (
  props,
) => {
  const { children } = props;

  return <Section>{children}</Section>;
};
