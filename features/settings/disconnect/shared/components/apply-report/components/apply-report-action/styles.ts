import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ButtonStyled = styled(Button)`
  width: fit-content;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
`;
