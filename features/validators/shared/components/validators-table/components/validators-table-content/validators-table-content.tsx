import { type FC, type MouseEvent, useCallback } from 'react';
import { zeroAddress } from 'viem';
import { Text, Thead } from '@lidofinance/lido-ui';

import type { ValidatorsEntry, FetchValidatorsParams } from 'modules/vaults';

import { useValidatorsTable } from 'features/validators/contexts';

import {
  MenuCell,
  BalanceCell,
  StatusCell,
  ActivateExitDate,
  ValidatorIndex,
  ValidatorPubkey,
} from '../../cells';
import {
  TableStyled,
  TableBody,
  TableRow,
  TableHeaderCell,
} from '../../styles';

type TableHeader = {
  title: string;
  sortKey?: FetchValidatorsParams['orderBy'];
};

const tableHeaders: TableHeader[] = [
  {
    title: 'Index',
    sortKey: 'index',
  },
  {
    title: 'Public key',
  },
  {
    title: 'CL Status',
    sortKey: 'status',
  },
  {
    title: 'Actual balance',
    sortKey: 'balance',
  },
  {
    title: 'Activated / exited',
  },
  {
    title: '',
  },
];

const PLACEHOLDER_VALIDATOR: ValidatorsEntry = {
  pubkey: zeroAddress,
  balance: 0n,
  activatedAt: new Date(),
  exitedAt: new Date(),
  index: 0,
  status: 'pending_initialised',
};

type ValidatorTableRowProps = {
  validator: ValidatorsEntry;
};

const ValidatorTableRowContent = ({ validator }: ValidatorTableRowProps) => {
  return (
    <>
      <ValidatorIndex index={validator.index} />
      <ValidatorPubkey pubkey={validator.pubkey} />
      <StatusCell status={validator.status} />
      <BalanceCell amount={validator.balance} />
      <ActivateExitDate
        activateDate={validator.activatedAt}
        exitDate={validator.exitedAt}
      />
      <MenuCell />
    </>
  );
};

const toUIsortDir = (dir?: FetchValidatorsParams['direction']) => {
  switch (dir) {
    case 'desc':
      return 'ASC';
    case 'asc':
      return 'DESC';
    default:
      return undefined;
  }
};

type ValidatorsTableProps = {
  dataTestId: string;
};

export const ValidatorsTableContent: FC<ValidatorsTableProps> = ({
  dataTestId,
}) => {
  const { validators, isLoading, isError, orderBy, direction, setSort } =
    useValidatorsTable();

  const isEmpty = (validators?.length ?? 0) === 0;
  const showTable = !(!isLoading && !isError && isEmpty);

  const onSortClick = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const columnKey = e.currentTarget.dataset.sortKey as
        | FetchValidatorsParams['orderBy']
        | undefined;

      if (!columnKey) return;

      if (columnKey === orderBy) {
        setSort?.(columnKey, direction === 'asc' ? 'desc' : 'asc');
      } else {
        setSort?.(columnKey, 'desc');
      }
    },
    [setSort, orderBy, direction],
  );

  if (!showTable) {
    return null;
  }

  const rows = validators?.length ? validators : [PLACEHOLDER_VALIDATOR];

  return (
    <TableStyled>
      <Thead>
        <TableRow>
          {tableHeaders.map(({ title, sortKey }) => (
            <TableHeaderCell
              data-sort-key={sortKey}
              align="left"
              onClick={sortKey ? onSortClick : undefined}
              sortDir={sortKey === orderBy ? toUIsortDir(direction) : undefined}
              key={title}
            >
              <Text size="xxs" strong>
                {title}
              </Text>
            </TableHeaderCell>
          ))}
        </TableRow>
      </Thead>
      <TableBody>
        {rows.map((validator) => {
          const { pubkey } = validator;

          return (
            <TableRow
              data-address={pubkey}
              key={pubkey}
              data-testid={
                dataTestId ? `${dataTestId}-validator-${pubkey}` : null
              }
            >
              <ValidatorTableRowContent validator={validator} />
            </TableRow>
          );
        })}
        {/*<QueryStatus*/}
        {/*  isLoading={isLoading}*/}
        {/*  isEmpty={isEmpty}*/}
        {/*  isError={isError}*/}
        {/*  refetch={refetch}*/}
        {/*/>*/}
      </TableBody>
    </TableStyled>
  );
};
