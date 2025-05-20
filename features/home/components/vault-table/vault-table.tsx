import { FC } from 'react';

import { Button, Loader, Pagination, Text } from '@lidofinance/lido-ui';

import { VaultTableInfo } from 'modules/vaults';
import { getHealthFactorColor } from 'utils';

import { TableCell } from './table-cell';
import {
  EtherCell,
  AddressCell,
  PercentCell,
  MintCell,
  HeaderCell,
} from './cells';
import {
  TableTitle,
  TableStyled,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  NonTableRow,
  SpacerRow,
} from './styles';
import { zeroAddress } from 'viem';

export type VaultTableProps = {
  title: string;
  emptyDisplay?: 'default' | 'hideTable';
  page?: number;
  setPage?: (page: number) => void;
  pagesCount?: number;
  vaults?: VaultTableInfo[];
  isLoading?: boolean;
  vaultsCount?: number;
  isError?: boolean;
  refetch?: () => void;
};

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

const PLACEHOLDER_VAULT: VaultTableInfo = {
  address: zeroAddress,
  totalValue: 0n,
  liabilityStETH: 0n,
  healthScore: 0,
  forcedRebalanceThresholdBP: 0,
  liabilityShares: 0n,
  owner: zeroAddress,
};

type VaultTableRowProps = {
  vault: VaultTableInfo;
};

const VaultTableRow = ({ vault }: VaultTableRowProps) => {
  return (
    <>
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
          color={getHealthFactorColor(vault.healthScore)}
        />
      </TableCell>
    </>
  );
};

type QueryStatusProps = {
  isError: boolean;
  isLoading: boolean;
  isEmpty: boolean;
  refetch?: () => void;
};

const QueryStatus = ({
  isEmpty,
  isError,
  isLoading,
  refetch,
}: QueryStatusProps) => {
  let content: JSX.Element | null = null;
  switch (true) {
    case isError:
      content = (
        <>
          <Text color="error" size="xs" weight={700}>
            Failed to fetch data
          </Text>
          {refetch && (
            <Button
              color="error"
              variant="ghost"
              size="xs"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          )}
        </>
      );
      break;
    case isLoading:
      content = <Loader size="medium" />;
      break;
    case isEmpty:
      content = (
        <Text color="secondary" size="xs" weight={700}>
          Vaults not found
        </Text>
      );
      break;
  }

  if (!content) return null;

  return (
    <>
      {/* SpacerRow predefines table cell to avoid layout shift */}
      {isEmpty && (
        <SpacerRow>
          <VaultTableRow vault={PLACEHOLDER_VAULT} />
        </SpacerRow>
      )}
      {/*  Overlay is shown only when loader is superimposed over data for correct bg color */}
      <NonTableRow overlay={!isEmpty}>
        <td>{content}</td>
      </NonTableRow>
    </>
  );
};

export const VaultTable: FC<VaultTableProps> = ({
  vaults,
  title,
  vaultsCount,
  refetch,
  emptyDisplay = 'default',
  isError = false,
  isLoading = false,
  page,
  setPage,
  pagesCount,
}) => {
  const isEmpty = (vaults?.length ?? 0) === 0;
  const showTable = !(
    emptyDisplay === 'hideTable' &&
    !isLoading &&
    !isError &&
    isEmpty
  );
  const showPagination = !!(pagesCount && pagesCount > 1 && setPage);
  return (
    <>
      <TableStyled>
        <TableTitle counter={vaultsCount}>{title}</TableTitle>
        {showTable && (
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
            <TableBody>
              {vaults?.map((vault) => {
                return (
                  <TableRow key={vault.address}>
                    <VaultTableRow vault={vault} />
                  </TableRow>
                );
              })}
              <QueryStatus
                isLoading={isLoading}
                isEmpty={isEmpty}
                isError={isError}
                refetch={refetch}
              />
            </TableBody>
          </>
        )}
      </TableStyled>
      {showPagination && (
        <Pagination
          onItemClick={setPage}
          pagesCount={pagesCount}
          siblingCount={1}
          activePage={page}
        />
      )}
    </>
  );
};
