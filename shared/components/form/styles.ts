import styled from 'styled-components';

import { DataTableRow } from '@lidofinance/lido-ui';

import { FormController } from 'shared/hook-form/form-controller';
import { devicesHeaderMedia } from 'styles/global';

type FormControllerType = typeof FormController;

export const FormControllerStyled: FormControllerType = styled(FormController)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  // styles from Block
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  border-radius: 20px;
  margin: 0;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  box-shadow: none;
  background: var(--lido-color-foreground);
  color: var(--lido-color-textSecondary);

  @media ${devicesHeaderMedia.mobile} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;

export const DataTableRowStyled: typeof DataTableRow = styled(DataTableRow)`
  margin: 0;
`;
