import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  padding-top: 20px;
  border-top: 1px solid var(--lido-color-border);

  & + & {
    margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  }

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
