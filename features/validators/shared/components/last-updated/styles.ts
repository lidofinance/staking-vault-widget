import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const LastUpdatedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media ${devicesHeaderMedia.mobile} {
    align-items: flex-start;
  }
`;
