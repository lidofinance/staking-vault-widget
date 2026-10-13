import styled from 'styled-components';

export const AcceptContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
`;
