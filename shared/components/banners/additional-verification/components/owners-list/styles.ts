import styled from 'styled-components';

export const OwnersListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AddressesList = styled.ul`
  list-style: none;
`;

export const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.text};
`;
