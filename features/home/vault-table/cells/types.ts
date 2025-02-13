import { ReactNode } from 'react';
import { ColumnConfig } from '../types';

export interface BaseCellProps<T = unknown> {
  value?: T;
  columnConfig?: ColumnConfig;
  children?: ReactNode;
}
