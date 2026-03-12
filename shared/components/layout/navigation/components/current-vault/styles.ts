import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const CurrentVaultWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  margin: ${({ theme }) => theme.spaceMap.md}px 0 0;
  height: 32px;
  width: fit-content;
  border-radius: 40px;
  border: 1px solid var(--lido-color-accentBorderHover);
  background-color: ${({ theme }) => theme.colors.background};
  overflow: clip;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
