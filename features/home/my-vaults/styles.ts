import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const MobileOnly = styled.div`
  display: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    display: flex;
  }
`;
