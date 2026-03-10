import styled from 'styled-components';
import { ButtonIcon } from '@lidofinance/lido-ui';

export const InputBlockWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;

  & label {
    width: 100%;
  }
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
