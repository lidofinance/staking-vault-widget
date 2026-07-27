import styled from 'styled-components';

export const RepayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
