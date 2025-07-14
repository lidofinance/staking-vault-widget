import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

export const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spaceMap.md}px;
`;
