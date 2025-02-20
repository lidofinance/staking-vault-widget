import { FC, ReactNode } from 'react';
import { Address } from 'viem';
import { TdProps } from '@lidofinance/lido-ui';

import { VaultInfo } from 'types';

export type CellComponentType =
  | 'address'
  | 'ether'
  | 'percent'
  | 'mint'
  | 'default';

export interface BaseCellProps<T = unknown> {
  value: T;
}

export interface TableCellProps extends TdProps {
  children: ReactNode;
}

type CellValueTypes = {
  address: `0x${string}`;
  ether: bigint;
  percent: number;
  mint: VaultInfo;
  default: unknown;
};

export type CellComponents = {
  [K in CellComponentType]: FC<BaseCellProps<CellValueTypes[K]>>;
};

export type CellComponent<T extends CellComponentType> = T extends 'address'
  ? FC<BaseCellProps<Address>>
  : T extends 'ether'
    ? FC<BaseCellProps<bigint>>
    : T extends 'percent'
      ? FC<BaseCellProps<number>>
      : T extends 'mint'
        ? FC<BaseCellProps<VaultInfo>>
        : FC<BaseCellProps>;

export type CellComponentMap = {
  [K in CellComponentType]: CellComponent<K>;
};
