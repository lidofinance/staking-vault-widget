import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const ButtonStyled = styled(Button)`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  min-width: 200px;
  width: fit-content;

  @media ${devicesHeaderMedia.mobile} {
    white-space: normal;
  }
`;
