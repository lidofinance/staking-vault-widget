import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ButtonStyled = styled(Button)`
  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    color: color-mix(
      in display-p3,
      ${({ theme }) => theme.colors.text} 50%,
      transparent
    );
    opacity: 1;
  }
`;
