import styled from 'styled-components';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;
`;

export const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  // fixing height sibling chart
  height: 24px;
`;
