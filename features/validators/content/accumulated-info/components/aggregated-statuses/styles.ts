import styled from 'styled-components';

export const StatusesContainer = styled.article`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;
