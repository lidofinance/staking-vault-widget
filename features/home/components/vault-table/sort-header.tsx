import { FC } from 'react';

import { Question } from '@lidofinance/lido-ui';
import { ArrowAnimated, SortHeader } from './styles';

import { VaultInfo } from 'types';
import { SortConfig } from './types';

export type SortableHeaderProps = {
  sortConfig: SortConfig;
  sortKey: keyof VaultInfo;
  label: string;
  onClick: (sortKey: keyof VaultInfo) => void;
  showQuestion?: boolean;
};

export const SortableHeader: FC<SortableHeaderProps> = ({
  onClick,
  sortConfig,
  sortKey,
  label,
  showQuestion = true,
}) => {
  return (
    <SortHeader onClick={() => onClick(sortKey)} role="columnheader">
      {label}
      {showQuestion && <Question />}
      <ArrowAnimated
        isActive={sortConfig.key === 'totalValue'}
        direction={sortConfig.direction}
      />
    </SortHeader>
  );
};
