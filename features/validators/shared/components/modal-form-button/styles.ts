import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ButtonStyled = styled(Button)`
  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 1;
  }
`;
