import styled from 'styled-components';
import { Address } from '@lidofinance/lido-ui';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AddressesList = styled.ul`
  list-style: none;
`;

export const ListItem = styled.li`
  color: ${({ theme }) => theme.colors.text};
`;

export const AddressStyled = styled(Address)`
  font-weight: bold;
`;
