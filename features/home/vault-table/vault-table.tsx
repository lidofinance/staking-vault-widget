import { FC, useMemo, useState } from 'react';

import { Tbody, Question } from '@lidofinance/lido-ui';
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
  ArrowAnimated,
  SortHeader,
} from './styles';

import { VaultInfo } from 'types';

export interface VaultTableProps {
  vaults: VaultInfo[];
  title: string;
  showTitle?: boolean;
}

export const VaultTable: FC<VaultTableProps> = (props) => {
  const { vaults, title, showTitle = false } = props;
  const [sortConfig, setSortConfig] = useState<{
    key: keyof VaultInfo | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  const showTableContent = !!vaults?.length;
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
                <SortHeader onClick={() => handleSort('valuation')}>
                  Valuation, ETH
                  <Question />
                  <ArrowAnimated
                    isActive={sortConfig.key === 'valuation'}
                    direction={sortConfig.direction}
                  />
                </SortHeader>
              </TableHeaderCell>
              <TableHeaderCell>
                <SortHeader onClick={() => handleSort('minted')}>
                  stETH Minted/ Mintable
                  <Question />
                  <ArrowAnimated
                    isActive={sortConfig.key === 'minted'}
                    direction={sortConfig.direction}
                  />
                </SortHeader>
              </TableHeaderCell>
              <TableHeaderCell>
                <SortHeader onClick={() => handleSort('apr')}>
                  apr
                  <Question />
                  <ArrowAnimated
                    isActive={sortConfig.key === 'apr'}
                    direction={sortConfig.direction}
                  />
                </SortHeader>
              </TableHeaderCell>
              <TableHeaderCell>
                <SortHeader onClick={() => handleSort('healthScore')}>
                  Health score
                  <Question />
                  <ArrowAnimated
                    isActive={sortConfig.key === 'healthScore'}
                    direction={sortConfig.direction}
                  />
                </SortHeader>
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
