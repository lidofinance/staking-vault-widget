import styled from 'styled-components';
import { ButtonIcon } from '@lidofinance/lido-ui';

export const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const ButtonContainer = styled(ButtonIcon)`
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
