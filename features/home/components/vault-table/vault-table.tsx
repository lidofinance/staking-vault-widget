import { FC } from 'react';

import { Tbody } from '@lidofinance/lido-ui';
import { TableCell } from 'features/home/components/vault-table/table-cell';
import {
  DefaultCell,
  EtherCell,
  AddressCell,
  PercentCell,
  MintCell,
  HeaderCell,
} from 'features/home/components/vault-table/cells';
import {
  TableTitle,
  TableStyled,
  TableHead,
  TableRow,
  TableHeaderCell,
} from './styles';

import { VaultInfo } from 'types';

export interface VaultTableProps {
  vaults?: VaultInfo[];
  title: string;
  showTitle?: boolean;
}

const tableHeaders = [
  {
    title: 'Vault Address / ENS',
    showQuestion: false,
  },
  {
    title: 'Valuation, ETH',
    showQuestion: true,
  },
  {
    title: 'stETH Minted',
    showQuestion: true,
  },
  {
    title: 'Net Staking APR',
    showQuestion: true,
  },
  {
    title: 'stVault APY',
    showQuestion: true,
  },
  {
    title: 'Health score',
    showQuestion: true,
  },
];

export const VaultTable: FC<VaultTableProps> = (props) => {
  const { vaults = [], title, showTitle = false } = props;
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
              {tableHeaders.map(({ title, showQuestion }) => (
                <TableHeaderCell key={title}>
                  <HeaderCell title={title} showQuestion={showQuestion} />
                </TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <Tbody>
            {vaults?.map((vault) => {
              return (
                <TableRow key={vault.address}>
                  <TableCell>
                    <AddressCell value={vault.address} />
                  </TableCell>
                  <TableCell>
                    <EtherCell value={vault.valuation} />
                  </TableCell>
                  <TableCell>
                    <MintCell value={vault.minted} />
                  </TableCell>
                  <TableCell>
                    <DefaultCell value="?" />
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
