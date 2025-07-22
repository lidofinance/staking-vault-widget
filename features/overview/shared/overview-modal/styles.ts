import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const AmountWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const AmountLoader = styled(InlineLoader)`
  height: 28px;
`;
