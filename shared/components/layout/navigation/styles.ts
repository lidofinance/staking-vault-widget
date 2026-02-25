import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const FeedbackLink = styled.a`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  padding-top: ${({ theme }) => theme.spaceMap.xxl}px;
  border-top: 1px solid var(--lido-color-border);

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;

export const SelectedVaultWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  margin: ${({ theme }) => theme.spaceMap.md}px 0 0;
  height: 32px;
  width: fit-content;
  border-radius: 40px;
  border: 1px solid var(--lido-color-accentBorderHover);
  background-color: var(--lido-color-background);
  overflow: clip;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
