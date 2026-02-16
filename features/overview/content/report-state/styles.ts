import { Link } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const ReportStateContainer = styled.article`
  display: flex;
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
`;

export const StyledLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;
