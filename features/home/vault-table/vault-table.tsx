import { FC, useCallback } from 'react';
import { isAddress, zeroAddress } from 'viem';
import { Button, Loader, Pagination, Text, Thead } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';

import { FormatToken } from 'shared/formatters';
import { appPaths } from 'consts/routing';
import { AddressBadge } from 'shared/components';
import { getHealthFactorColor } from 'utils';
import { type FetchVaultsParams, VaultEntry } from 'modules/vaults';

import { ReindexState } from 'features/home/reindex-state';
import { PercentCell, HeaderCell } from './cells';
import {
  TableTitle,
  TableStyled,
  TableBody,
  TableRow,
  TableHeaderCell,
  NonTableRow,
  SpacerRow,
  TableCell,
  TableContainer,
  ScrollableContainer,
  TableTitleContainer,
} from './styles';

export type VaultTableProps = {
  title: string;
  emptyDisplay?: 'default' | 'hideTable';
  page?: number;
  setPage?: (page: number) => void;
  sortBy?: FetchVaultsParams['sortBy'];
  sortDir?: FetchVaultsParams['sortDir'];
  setSort?: (
    sortBy: FetchVaultsParams['sortBy'],
    sortDir: FetchVaultsParams['sortDir'],
  ) => void;
  pagesCount?: number;
  vaults?: VaultEntry[];
  isLoading?: boolean;
  vaultsCount?: number;
  isError?: boolean;
  refetch?: () => void;
  dataTestId?: string;
  nextUpdateAt?: Date;
};

const tableHeaders = [
  {
    title: 'Vault Address',
  },
  {
    title: 'Total value, ETH',
    sortKey: 'totalValue',
    hint: 'The total amount of ETH deposited on validators and on the vault balance.',
  },
  {
    title: 'stETH liability',
    sortKey: 'liabilityStETH',
    hint: 'The amount of stETH that the vault owner minted in the vault backed by the ETH collateral. Increases daily due to daily stETH rebase.',
  },
  {
    title: 'Net Staking APR',
    sortKey: 'netStakingAprSma',
  },
  {
    title: 'Carry Spread',
    sortKey: 'carrySpreadAprPercent',
  },
  {
    title: 'Health factor',
    sortKey: 'healthFactor',
    hint: 'Health Factor of the vault that demonstrates the economic state of the vault. It shows how the stETH Liability is collateralized by Total value.',
  },
];

const PLACEHOLDER_VAULT: VaultEntry = {
  address: zeroAddress,
  totalValue: 0n,
  liabilityStETH: 0n,
  healthFactor: 0,
  carrySpreadAprPercent: 0,
  netStakingAprSma: 0,
  bottomLine: 0n,
};

type VaultTableRowProps = {
  vault: VaultEntry;
  dataTestId?: string;
};

const VaultTableRowContent = ({ vault, dataTestId }: VaultTableRowProps) => {
  return (
    <>
      <TableCell
        data-testid={dataTestId ? `${dataTestId}-addressCell` : undefined}
      >
        <AddressBadge
          weight={700}
          showPopover="hover"
          hoverEffect={false}
          popoverPlacement="top"
          address={vault.address}
          dataTestId={`${dataTestId}-addressCell`}
        />
      </TableCell>
      <TableCell
        align="right"
        data-testid={dataTestId ? `${dataTestId}-totalValueCell` : undefined}
      >
        <FormatToken amount={vault.totalValue} />
      </TableCell>
      <TableCell
        align="right"
        data-testid={dataTestId ? `${dataTestId}-liabilityCell` : undefined}
      >
        <FormatToken amount={vault?.liabilityStETH} />
      </TableCell>
      <TableCell
        align="right"
        data-testid={dataTestId ? `${dataTestId}-netStakingAprCell` : undefined}
      >
        <PercentCell value={vault.netStakingAprSma} />
      </TableCell>
      <TableCell
        align="right"
        data-testid={
          dataTestId ? `${dataTestId}-carrySpreadAprCell` : undefined
        }
      >
        <PercentCell value={vault.carrySpreadAprPercent} />
      </TableCell>
      <TableCell
        align="right"
        data-testid={dataTestId ? `${dataTestId}-healthFactorCell` : undefined}
      >
        <PercentCell
          value={vault.healthFactor}
          strong
          color={getHealthFactorColor(vault.healthFactor)}
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
          <VaultTableRowContent vault={PLACEHOLDER_VAULT} />
        </SpacerRow>
      )}
      {/*  Overlay is shown only when loader is superimposed over data for correct bg color */}
      <NonTableRow overlay={!isEmpty}>
        <td>{content}</td>
      </NonTableRow>
    </>
  );
};

const toUIsortDir = (dir?: FetchVaultsParams['sortDir']) => {
  switch (dir) {
    case 'desc':
      return 'ASC';
    case 'asc':
      return 'DESC';
    default:
      return undefined;
  }
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
  sortBy,
  setSort,
  sortDir,
  pagesCount,
  nextUpdateAt,
  dataTestId,
}) => {
  const router = useRouter();
  const isEmpty = (vaults?.length ?? 0) === 0;
  const showTable = !(
    emptyDisplay === 'hideTable' &&
    !isLoading &&
    !isError &&
    isEmpty
  );

  const showPagination = !!(pagesCount && pagesCount > 1 && setPage);

  const onRowClick = useCallback(
    (e: React.MouseEvent<HTMLTableRowElement>) => {
      const vaultAddress = e.currentTarget.dataset.address;
      if (vaultAddress && isAddress(vaultAddress)) {
        void router.push(appPaths.vaults.vault(vaultAddress).overview);
      }
    },
    [router],
  );

  const onSortClick = useCallback(
    (e: React.MouseEvent<HTMLTableCellElement>) => {
      const columnKey = e.currentTarget.dataset.sortKey as
        | FetchVaultsParams['sortBy']
        | undefined;

      if (!columnKey) return;

      if (columnKey === sortBy) {
        setSort?.(columnKey, sortDir === 'asc' ? 'desc' : 'asc');
      } else {
        setSort?.(columnKey, 'desc');
      }
    },
    [setSort, sortBy, sortDir],
  );

  return (
    <TableContainer>
      <TableTitleContainer>
        <TableTitle
          counter={vaultsCount}
          data-testid={dataTestId ? `${dataTestId}-tableTitle` : undefined}
        >
          {title}
        </TableTitle>
        <ReindexState isLoading={isLoading} nextUpdateAt={nextUpdateAt} />
      </TableTitleContainer>
      <ScrollableContainer>
        <TableStyled>
          {showTable && (
            <>
              <Thead>
                <TableRow>
                  {tableHeaders.map(({ title, hint, sortKey }) => (
                    <TableHeaderCell
                      data-sort-key={sortKey}
                      align="left"
                      onClick={sortKey && setSort ? onSortClick : undefined}
                      sortDir={
                        sortKey === sortBy ? toUIsortDir(sortDir) : undefined
                      }
                      key={title}
                    >
                      <HeaderCell hint={hint} title={title} />
                    </TableHeaderCell>
                  ))}
                </TableRow>
              </Thead>
              <TableBody>
                {vaults?.map((vault) => {
                  return (
                    <TableRow
                      onClick={onRowClick}
                      data-address={vault.address}
                      key={vault.address}
                      data-testid={
                        dataTestId
                          ? `${dataTestId}-vault-${vault.address}`
                          : null
                      }
                    >
                      <VaultTableRowContent
                        vault={vault}
                        dataTestId={`${dataTestId}-vault-${vault.address}`}
                      />
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
      </ScrollableContainer>
      {showPagination && setPage && typeof page == 'number' && (
        <Pagination
          onItemClick={setPage}
          pagesCount={pagesCount}
          siblingCount={1}
          activePage={page}
          data-testid={dataTestId ? `${dataTestId}-pagination` : undefined}
        />
      )}
    </TableContainer>
  );
};
