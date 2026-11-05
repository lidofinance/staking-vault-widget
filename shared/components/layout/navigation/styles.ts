import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const NavList = styled.ul<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: ${({ theme, $gap }) => $gap ?? theme.spaceMap.md}px;
  list-style-type: none;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: row;
    justify-content: space-around;
    align-items: start;
    width: 100%;
    margin-top: 0;
    gap: 8px;
  }
`;
