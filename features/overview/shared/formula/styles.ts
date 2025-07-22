import styled from 'styled-components';
import { Chip } from '@lidofinance/lido-ui';

export const FormulaWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Variable = styled(Chip)`
  color: ${({ theme }) => theme.colors.text};
`;
