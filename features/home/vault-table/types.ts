import { ReactNode } from 'react';
import { TdProps } from '@lidofinance/lido-ui';

import { VaultInfo } from 'types';

export interface BaseCellProps<T = unknown> {
  value: T;
}

export interface TableCellProps extends TdProps {
  children: ReactNode;
}

export interface SortConfig {
  key: keyof VaultInfo;
  direction: 'asc' | 'desc';
}
