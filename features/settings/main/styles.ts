import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const Skeleton = styled(InlineLoader)`
  height: 36px;
  max-width: 50%;

  @media ${devicesHeaderMedia.mobile} {
    max-width: 100%;
  }
`;
