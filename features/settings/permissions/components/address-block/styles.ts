import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  @media ${devicesHeaderMedia.mobile} {
    width: 100%;
  }
`;
