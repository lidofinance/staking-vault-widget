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
