import { type FC, type MouseEvent, useCallback } from 'react';
import { Text, Thead } from '@lidofinance/lido-ui';

import { ReactComponent as TopBottomArrows } from 'assets/icons/top-bottom-arrows.svg';
import {
  type ValidatorsEntry,
  type FetchValidatorsParams,
  ValidatorsOrderByEnum,
  vaultTexts,
} from 'modules/vaults';

import { useValidators } from 'features/validators/contexts';

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
  TableHeaderCellContent,
  EmptyStateCell,
} from './styles';

type TableHeader = {
  title: string;
  sortKey?: FetchValidatorsParams['orderBy'];
};

const { noValidatorsFound, header } = vaultTexts.actions.validators.table;

const tableHeaders: TableHeader[] = [
  {
    title: header.index,
    sortKey: ValidatorsOrderByEnum.INDEX,
  },
  {
    title: header.pubKey,
  },
  {
    title: header.status,
    sortKey: ValidatorsOrderByEnum.STATUS,
  },
  {
    title: header.actualBalance,
    sortKey: ValidatorsOrderByEnum.BALANCE,
  },
  {
    title: header.activatedExited,
    sortKey: ValidatorsOrderByEnum.ACTIVATED_AT,
  },
  {
    title: header.menu,
  },
];

type ValidatorTableRowProps = {
  validator: ValidatorsEntry;
  hideTableMenu: boolean;
};

const ValidatorTableRowContent = ({
  validator,
  hideTableMenu,
}: ValidatorTableRowProps) => {
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
      {!hideTableMenu && <MenuCell validator={validator} />}
    </>
  );
};

const ValidatorNotFound = ({ columnCount }: { columnCount: number }) => {
  return (
    <TableRow>
      <EmptyStateCell colSpan={columnCount}>
        <Text size="xxs" color="secondary">
          {noValidatorsFound}
        </Text>
      </EmptyStateCell>
    </TableRow>
  );
};

type ValidatorsTableProps = {
  dataTestId: string;
};

export const ValidatorsTableContent: FC<ValidatorsTableProps> = ({
  dataTestId,
}) => {
  const {
    validators,
    isLoading,
    isError,
    orderBy,
    direction,
    setSort,
    hideTableMenu,
  } = useValidators();
  const isEmpty = (validators?.length ?? 0) === 0;

  const onSortClick = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const columnKey = e.currentTarget.dataset.sortKey as
        | FetchValidatorsParams['orderBy']
        | undefined;

      if (!columnKey) return;

      if (columnKey === orderBy) {
        setSort(columnKey, direction === 'ASC' ? 'DESC' : 'ASC');
      } else {
        setSort(columnKey, 'DESC');
      }
    },
    [setSort, orderBy, direction],
  );

  const rows = validators?.length ? validators : [];
  const shouldShowEmptyState = !isLoading && !isError && isEmpty;
  const columnCount = hideTableMenu
    ? tableHeaders.length - 1
    : tableHeaders.length;

  return (
    <TableStyled>
      <Thead>
        <TableRow>
          {tableHeaders.map(({ title, sortKey }, index) => {
            if (hideTableMenu && tableHeaders.length - 1 === index) {
              return null;
            }

            return (
              <TableHeaderCell
                data-sort-key={sortKey}
                align="left"
                onClick={sortKey ? onSortClick : undefined}
                key={title}
              >
                <TableHeaderCellContent>
                  <Text size="xxs" strong>
                    {title}
                  </Text>
                  {sortKey && <TopBottomArrows />}
                </TableHeaderCellContent>
              </TableHeaderCell>
            );
          })}
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
              <ValidatorTableRowContent
                validator={validator}
                hideTableMenu={hideTableMenu}
              />
            </TableRow>
          );
        })}
        {shouldShowEmptyState && (
          <ValidatorNotFound columnCount={columnCount} />
        )}
      </TableBody>
    </TableStyled>
  );
};
