import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Section = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
  }
`;
