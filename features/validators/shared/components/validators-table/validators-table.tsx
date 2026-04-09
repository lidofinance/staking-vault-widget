import type { FC } from 'react';

import {
  FilterPubkeyIndex,
  FilterByStatus,
  ValidatorsTableContent,
  TablePagination,
} from './components';
import { TableContainer, ScrollableContainer, SearchContainer } from './styles';

const dataTestId = 'validators-table';

export const ValidatorsTable: FC = () => {
  return (
    <TableContainer>
      <SearchContainer>
        <FilterPubkeyIndex dataTestId={dataTestId} />
        <FilterByStatus dataTestId={dataTestId} />
      </SearchContainer>
      <ScrollableContainer>
        <ValidatorsTableContent dataTestId={dataTestId} />
      </ScrollableContainer>
      <TablePagination dataTestId={dataTestId} />
    </TableContainer>
  );
};
