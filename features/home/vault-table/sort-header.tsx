import { Question } from '@lidofinance/lido-ui';

import { ArrowAnimated, SortHeader } from './styles';

import { VaultInfo } from 'types';
import { SortConfig } from './types';

export type SortableHeaderProps = {
  sortConfig: SortConfig;
  sortKey: keyof VaultInfo;
  label: string;
  onClick: (sortKey: keyof VaultInfo) => void;
  align?: 'left' | 'right' | 'center';
};

export const SortableHeader = ({
  onClick,
  sortConfig,
  sortKey,
  label,
  align = 'center',
}: SortableHeaderProps) => {
  return (
    <SortHeader
      onClick={() => onClick(sortKey)}
      role="columnheader"
      align={align}
    >
      {label}
      <Question />
      <ArrowAnimated
        isActive={sortConfig.key === 'valuation'}
        direction={sortConfig.direction}
      />
    </SortHeader>
  );
};
