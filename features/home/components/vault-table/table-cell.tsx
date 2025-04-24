import { TableCellStyled } from 'features/home/components/vault-table/styles';

import { TableCellProps } from 'features/home/components/vault-table/types';

export const TableCell = (props: TableCellProps) => {
  const { children, ...rest } = props;

  return <TableCellStyled {...rest}>{children}</TableCellStyled>;
};
