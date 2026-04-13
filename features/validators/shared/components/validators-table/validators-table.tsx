import type { FC } from 'react';

import { ValidatorModalProvider } from 'features/validators/contexts';

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
        <ValidatorModalProvider>
          <ValidatorsTableContent dataTestId={dataTestId} />
        </ValidatorModalProvider>
      </ScrollableContainer>
      <TablePagination dataTestId={dataTestId} />
    </TableContainer>
  );
};
