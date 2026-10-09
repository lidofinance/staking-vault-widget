import styled from 'styled-components';

export const RoleAddressesListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const RoleGroup = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  line-height: 20px;
`;

export const RoleLabel = styled.span`
  color: ${({ theme }) => theme.colors.text};
`;

export const AddressesList = styled.ul`
  list-style: none;
`;

export const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.text};
`;
