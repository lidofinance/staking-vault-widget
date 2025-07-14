import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const GeneralLoader = styled(InlineLoader)`
  height: 72px;

  @media ${devicesHeaderMedia.mobile} {
    height: 56px;
  }
`;
