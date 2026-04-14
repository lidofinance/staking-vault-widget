import styled from 'styled-components';
import { Select } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const SelectStyled = styled(Select)`
  @media ${devicesHeaderMedia.mobile} {
    width: 100%;
  }
`;
