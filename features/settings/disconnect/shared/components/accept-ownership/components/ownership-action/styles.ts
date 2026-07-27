import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ButtonStyled = styled(Button)`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  min-width: 200px;
  width: fit-content;
`;
