import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;

export const Skeleton = styled(InlineLoader)`
  height: 36px;
  max-width: 50%;

  @media ${devicesHeaderMedia.mobile} {
    max-width: 100%;
  }
`;
