import type { FC } from 'react';

import { ValidatorModalProvider } from 'features/validators/contexts';

import {
  FilterPubkeyIndex,
  FilterByStatus,
  ValidatorsTableContent,
  TablePagination,
} from './components';
import { TableContainer, ScrollableContainer, SearchContainer } from './styles';

export const ValidatorsTable: FC = () => {
  return (
    <TableContainer data-testid="validators-list">
      <SearchContainer data-testid="filter-header">
        <FilterPubkeyIndex />
        <FilterByStatus />
      </SearchContainer>
      <ScrollableContainer data-testid="validators-table">
        <ValidatorModalProvider>
          <ValidatorsTableContent />
        </ValidatorModalProvider>
      </ScrollableContainer>
      <TablePagination />
    </TableContainer>
  );
};
