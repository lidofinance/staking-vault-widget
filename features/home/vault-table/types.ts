import { ReactNode } from 'react';
import { TdProps } from '@lidofinance/lido-ui';

export type CellComponentType =
  | 'address'
  | 'ether'
  | 'percent'
  | 'mint'
  | 'default';

export interface ColumnConfig {
  type?: CellComponentType;
  sortable?: boolean;
  link?: string;
  formatOptions?: Intl.NumberFormatOptions | Intl.DateTimeFormatOptions;
}

export interface TableCellProps extends TdProps {
  value?: unknown;
  columnConfig?: ColumnConfig;
  children?: ReactNode;
}
