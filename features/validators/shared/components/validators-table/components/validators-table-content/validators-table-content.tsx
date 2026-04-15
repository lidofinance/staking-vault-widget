import { type FC, type MouseEvent, useCallback } from 'react';
import { Text, Thead } from '@lidofinance/lido-ui';

import { ReactComponent as TopBottomArrows } from 'assets/icons/top-bottom-arrows.svg';
import {
  ValidatorsEntry,
  FetchValidatorsParams,
  ValidatorsOrderByEnum,
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
} from './styles';

type TableHeader = {
  title: string;
  sortKey?: FetchValidatorsParams['orderBy'];
};

const tableHeaders: TableHeader[] = [
  {
    title: 'Index',
    sortKey: ValidatorsOrderByEnum.INDEX,
  },
  {
    title: 'Public key',
  },
  {
    title: 'Status',
    sortKey: ValidatorsOrderByEnum.STATUS,
  },
  {
    title: 'Actual balance',
    sortKey: ValidatorsOrderByEnum.BALANCE,
  },
  {
    title: 'Activated / exited',
    sortKey: ValidatorsOrderByEnum.ACTIVATED_AT,
  },
  {
    title: '',
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
  const showTable = !(!isLoading && !isError && isEmpty);

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

  if (!showTable) {
    return null;
  }

  const rows = validators?.length ? validators : [];

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
      </TableBody>
    </TableStyled>
  );
};
