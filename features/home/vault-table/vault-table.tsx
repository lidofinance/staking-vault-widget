import { FC } from 'react';

import { Tbody } from '@lidofinance/lido-ui';
import { TableCell } from 'features/home/vault-table/table-cell';
import {
  DefaultCell,
  EtherCell,
  AddressCell,
  PercentCell,
  MintCell,
} from 'features/home/vault-table/cells';
import { SortableHeader } from 'features/home/vault-table/sort-header';
import {
  TableTitle,
  TableStyled,
  TableHead,
  TableRow,
  TableHeaderCell,
} from './styles';

import { useTableSort } from 'features/home/vault-table/hooks';

import { VaultInfo } from 'types';

export interface VaultTableProps {
  vaults?: VaultInfo[];
  title: string;
  showTitle?: boolean;
}

export const VaultTable: FC<VaultTableProps> = (props) => {
  const { vaults = [], title, showTitle = false } = props;
  const { sortedItems, sortConfig, handleSort } = useTableSort(vaults, {
    key: 'valuation',
    direction: 'asc',
  });
  const showTableContent = vaults.length > 0;
  const showTitleWhenNoContent = showTitle || showTableContent;

  return (
    <TableStyled>
      {showTitleWhenNoContent && (
        <TableTitle counter={vaults.length}>{title}</TableTitle>
      )}

      {showTableContent && (
        <>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Vault Address / ENS</TableHeaderCell>
              <TableHeaderCell>
                <SortableHeader
                  label="Valuation, ETH"
                  sortKey="valuation"
                  sortConfig={sortConfig}
                  onClick={handleSort}
                />
              </TableHeaderCell>
              <TableHeaderCell>
                <SortableHeader
                  label="stETH Minted/ Mintable"
                  sortKey="minted"
                  sortConfig={sortConfig}
                  onClick={handleSort}
                />
              </TableHeaderCell>
              <TableHeaderCell>
                <SortableHeader
                  label="APR"
                  sortKey="apr"
                  sortConfig={sortConfig}
                  onClick={handleSort}
                />
              </TableHeaderCell>
              <TableHeaderCell>
                <SortableHeader
                  label="Health score"
                  sortKey="healthScore"
                  sortConfig={sortConfig}
                  onClick={handleSort}
                />
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <Tbody>
            {sortedItems.map((vault) => {
              return (
                <TableRow key={vault.address}>
                  <TableCell>
                    <AddressCell value={vault.address} />
                  </TableCell>
                  <TableCell>
                    <EtherCell value={vault.valuation} />
                  </TableCell>
                  <TableCell>
                    <MintCell value={vault} />
                  </TableCell>
                  <TableCell>
                    <DefaultCell value="?" />
                  </TableCell>
                  <TableCell>
                    <PercentCell value={vault.healthScore} />
                  </TableCell>
                </TableRow>
              );
            })}
          </Tbody>
        </>
      )}
    </TableStyled>
  );
};
