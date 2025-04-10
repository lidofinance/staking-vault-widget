import styled from 'styled-components';

export const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  max-width: 806px;
  margin: 0 auto;
`;
