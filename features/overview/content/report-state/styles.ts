import { Link } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const ReportStateContainer = styled.div`
  display: flex;
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-end;
  height: 21px;
  gap: 8px;
`;

export const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const StyledLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;
