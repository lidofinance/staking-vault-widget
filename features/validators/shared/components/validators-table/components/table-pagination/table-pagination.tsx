import type { FC } from 'react';
import { Pagination } from '@lidofinance/lido-ui';

import { isNumber } from 'utils';

import { useValidators } from 'features/validators/contexts';

type TablePaginationProps = {
  dataTestId: string;
};

export const TablePagination: FC<TablePaginationProps> = ({ dataTestId }) => {
  const { totalPages, setPage, page } = useValidators();
  const showPagination =
    isNumber(totalPages) && totalPages > 1 && isNumber(page);

  if (!showPagination) {
    return null;
  }

  return (
    <Pagination
      onItemClick={setPage}
      pagesCount={totalPages}
      siblingCount={1}
      activePage={page}
      data-testid={`${dataTestId}-pagination`}
    />
  );
};
