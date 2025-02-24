import { FC, useMemo, useState } from 'react';

import { Tbody } from '@lidofinance/lido-ui';
import { TableCell } from 'features/home/vault-table/table-cell';
import {
  DefaultCell,
  EtherCell,
  AddressCell,
  PercentCell,
  MintCell,
} from 'features/home/vault-table/cells';

import {
  TableTitle,
  TableStyled,
  TableHead,
  TableRow,
  TableHeaderCell,
} from './styles';

import { VaultInfo } from 'types';
import { SortConfig } from './types';
import { SortableHeader } from './sort-header';

export interface VaultTableProps {
  vaults?: VaultInfo[];
  title: string;
  showTitle?: boolean;
}

export const VaultTable: FC<VaultTableProps> = (props) => {
  const { vaults = [], title, showTitle = false } = props;
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'valuation',
    direction: 'asc',
  });
  const showTableContent = vaults.length > 0;
  const showTitleWhenNoContent = showTitle || showTableContent;

  const handleSort = (key: keyof VaultInfo) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedVaults = useMemo(() => {
    if (!sortConfig.key) {
      return vaults;
    }

    const { key } = sortConfig;
    return [...vaults].sort((a, b) => {
      let aValue = a[key] ?? 0;
      let bValue = b[key] ?? 0;

      if (sortConfig.direction !== 'asc') {
        const temp = aValue;
        aValue = bValue;
        bValue = temp;
      }

      if (aValue > bValue) {
        return 1;
      } else if (bValue > aValue) {
        return -1;
      }

      return 0;
    });
  }, [vaults, sortConfig]);

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
            {sortedVaults.map((vault) => {
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
