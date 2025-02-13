import { FC } from 'react';

import {
  DefaultCell,
  EtherCell,
  AddressCell,
  PercentCell,
  MintCell,
  type BaseCellProps,
} from 'features/home/vault-table/cells';
import { TableCellStyled } from 'features/home/vault-table/style';

import {
  CellComponentType,
  TableCellProps,
} from 'features/home/vault-table/types';

const cellComponents: Record<CellComponentType, FC<BaseCellProps>> = {
  address: AddressCell,
  ether: EtherCell,
  percent: PercentCell,
  mint: MintCell,
  default: DefaultCell,
};

export const TableCell = ({
  value,
  columnConfig,
  children,
  ...rest
}: TableCellProps) => {
  const cellType = columnConfig?.type ?? 'default';
  const CellComponent = cellComponents[cellType] ?? DefaultCell;

  return (
    <TableCellStyled {...rest}>
      <CellComponent value={value} columnConfig={columnConfig}>
        {children}
      </CellComponent>
    </TableCellStyled>
  );
};
