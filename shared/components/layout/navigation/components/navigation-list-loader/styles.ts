import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const LoaderItem = styled.li`
  display: flex;
  align-items: center;
  height: fit-content;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
