import styled from 'styled-components';
import { ButtonIcon } from '@lidofinance/lido-ui';

export const AddressListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const AddAddress = styled(ButtonIcon)`
  width: fit-content;
  padding: 0;

  &:hover,
  &:active {
    background: none;
  }

  &::before {
    background: none;
  }
`;
