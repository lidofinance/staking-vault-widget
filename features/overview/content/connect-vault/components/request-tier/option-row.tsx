import type { ReactNode } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { OptionWrapper } from './styles';

type OptionRowProps = {
  label: string;
  children: ReactNode;
};

export const OptionRow = ({ label, children }: OptionRowProps) => (
  <OptionWrapper>
    <Text size="xxs">{label}</Text>
    <Text size="xxs" strong>
      {children}
    </Text>
  </OptionWrapper>
);
