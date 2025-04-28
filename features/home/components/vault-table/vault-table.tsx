import { FC } from 'react';

import { Tbody } from '@lidofinance/lido-ui';
import { TableCell } from 'features/home/components/vault-table/table-cell';
import {
  EtherCell,
  AddressCell,
  PercentCell,
  MintCell,
  HeaderCell,
} from 'features/home/components/vault-table/cells';
import { VaultTableInfo } from 'modules/vaults';
import { getHealthFactorColor } from 'utils';

import {
  TableTitle,
  TableStyled,
  TableHead,
  TableRow,
  TableHeaderCell,
} from './styles';

export interface VaultTableProps {
  vaults?: VaultTableInfo[];
  title: string;
  showTitle?: boolean;
  vaultsCount: number;
}

const tableHeaders = [
  {
    title: 'Vault Address / ENS',
    showQuestion: false,
  },
  {
    title: 'Total value, ETH',
    showQuestion: true,
  },
  {
    title: 'stETH liability',
    showQuestion: true,
  },
  // {
  //   title: 'Net Staking APR',
  //   showQuestion: true,
  // },
  // {
  //   title: 'stVault APY',
  //   showQuestion: true,
  // },
  {
    title: 'Health factor',
    showQuestion: true,
  },
];

export const VaultTable: FC<VaultTableProps> = (props) => {
  const { vaults = [], title, showTitle = false, vaultsCount } = props;
  const showTableContent = vaults.length > 0;
  const showTitleWhenNoContent = showTitle || showTableContent;

  return (
    <TableStyled>
      {showTitleWhenNoContent && (
        <TableTitle counter={vaultsCount}>{title}</TableTitle>
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
              const healthColor = getHealthFactorColor(vault.healthScore);

              return (
                <TableRow key={vault.address}>
                  <TableCell>
                    <AddressCell value={vault.address} />
                  </TableCell>
                  <TableCell>
                    <EtherCell value={vault.totalValue} />
                  </TableCell>
                  <TableCell>
                    <MintCell value={vault.liabilityStETH} />
                  </TableCell>
                  <TableCell>
                    <PercentCell
                      value={vault.healthScore}
                      color={healthColor}
                    />
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
