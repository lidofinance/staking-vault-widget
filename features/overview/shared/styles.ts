import styled from 'styled-components';
import { Divider } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const SectionDivider = styled(Divider)`
  border-top-width: 2px;
`;

export const OverviewSection = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
  }
`;
