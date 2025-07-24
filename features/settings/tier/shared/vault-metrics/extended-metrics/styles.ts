import styled from 'styled-components';

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  list-style: none;
`;

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
