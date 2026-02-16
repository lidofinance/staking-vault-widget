import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.nav`
  display: none;

  @media ${devicesHeaderMedia.mobile} {
    display: flex;
    margin-block: ${({
      theme: {
        spaceMap: { sm, lg },
      },
    }) => `${sm}px ${lg}px`};
  }
`;
