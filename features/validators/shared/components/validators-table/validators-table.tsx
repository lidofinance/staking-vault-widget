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
    <TableContainer>
      <SearchContainer>
        <FilterPubkeyIndex />
        <FilterByStatus />
      </SearchContainer>
      <ScrollableContainer>
        <ValidatorModalProvider>
          <ValidatorsTableContent />
        </ValidatorModalProvider>
      </ScrollableContainer>
      <TablePagination />
    </TableContainer>
  );
};
