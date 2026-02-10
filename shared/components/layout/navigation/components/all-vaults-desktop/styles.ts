import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.div`
  display: contents;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
