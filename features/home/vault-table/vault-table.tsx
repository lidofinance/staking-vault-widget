import { FC } from 'react';
import { Tbody, Td, Question, ArrowBottom } from '@lidofinance/lido-ui';

import { AddressBadge } from 'shared/components';

import { VaultInfo } from 'types';

import {
  TableTitle,
  TableStyled,
  TableHead,
  TableRow,
  TableHeaderCell,
} from './style';

export interface VaultTableProps {
  vaults: VaultInfo[];
  title: string;
  showTitle?: boolean;
}

export const VaultTable: FC<VaultTableProps> = (props) => {
  const { vaults, title, showTitle = false } = props;
  const showTableContent = !!vaults?.length;
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
                Valuation, ETH
                <Question />
                <ArrowBottom />
              </TableHeaderCell>
              <TableHeaderCell>
                stETH Minted/ Mintable
                <Question />
                <ArrowBottom />
              </TableHeaderCell>
              <TableHeaderCell>
                APR
                <Question />
                <ArrowBottom />
              </TableHeaderCell>
              <TableHeaderCell>
                Health score
                <Question />
                <ArrowBottom />
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <Tbody>
            {vaults.map((vault) => {
              return (
                <TableRow key={vault.address}>
                  <Td>
                    <AddressBadge address={vault.address} />
                  </Td>
                  <Td>{vault.valuation}</Td>
                  <Td>
                    {vault.minted} / {vault.mintable}
                  </Td>
                  <Td>?</Td>
                  <Td>{vault.healthScore}</Td>
                </TableRow>
              );
            })}
          </Tbody>
        </>
      )}
    </TableStyled>
  );
};
