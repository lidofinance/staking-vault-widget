import { FC, useCallback } from 'react';

import { Button, Loader, Pagination, Text } from '@lidofinance/lido-ui';

import { VaultTableInfo } from 'modules/vaults';
import { getHealthFactorColor } from 'utils';

import { PercentCell, HeaderCell } from './cells';
import {
  TableTitle,
  TableStyled,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  NonTableRow,
  SpacerRow,
  TableCell,
} from './styles';
import { isAddress, zeroAddress } from 'viem';
import { FormatToken } from 'shared/formatters';
import { useRouter } from 'next/router';
import { appPaths } from 'consts/routing';
import { AddressBadge } from 'shared/components';

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
  },
  {
    title: 'Total value, ETH',
  },
  {
    title: 'stETH liability',
  },
  // {
  //   title: 'Net Staking APR',
  // },
  // {
  //   title: 'stVault APY',
  // },
  {
    title: 'Health factor',
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

const VaultTableRowContent = ({ vault }: VaultTableRowProps) => {
  return (
    <>
      <TableCell>
        <AddressBadge
          weight={700}
          showPopover
          popoverMode="hover"
          popoverPlacement="top"
          address={vault.address}
        />
      </TableCell>
      <TableCell align="right">
        <FormatToken amount={vault.totalValue} />
      </TableCell>
      <TableCell align="right">
        <FormatToken amount={vault.liabilityStETH} />
      </TableCell>
      <TableCell align="right">
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

  return (
    <>
      <TableStyled>
        <TableTitle counter={vaultsCount}>{title}</TableTitle>
        {showTable && (
          <>
            <TableHead>
              <TableRow>
                {tableHeaders.map(({ title }) => (
                  <TableHeaderCell key={title}>
                    <HeaderCell title={title} />
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vaults?.map((vault) => {
                return (
                  <TableRow
                    onClick={onRowClick}
                    data-address={vault.address}
                    key={vault.address}
                  >
                    <VaultTableRowContent vault={vault} />
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
