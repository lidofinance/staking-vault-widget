import styled from 'styled-components';
import { ButtonIcon } from '@lidofinance/lido-ui';

export const EditWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  & > label {
    width: 100%;
  }
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
