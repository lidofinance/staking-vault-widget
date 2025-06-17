import styled from 'styled-components';

import { FormController } from 'shared/hook-form/form-controller';
import { DataTableRow } from '@lidofinance/lido-ui';

type FormControllerType = typeof FormController;

export const FormControllerStyled: FormControllerType = styled(FormController)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  // styles from Block
  font-weight: 400;
  font-size: 12px;
  line-height: 1.6em;
  border-radius: 20px;
  margin: 0;
  padding: 32px;
  box-shadow: none;
  background: var(--lido-color-foreground);
  color: var(--lido-color-textSecondary);
`;

export const DataTableRowStyled: typeof DataTableRow = styled(DataTableRow)`
  margin: 0;
`;
