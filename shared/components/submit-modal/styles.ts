import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
`;
