import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;

  @media ${devicesHeaderMedia.mobile} {
    margin-top: ${({ theme }) => theme.spaceMap.xs}px;
  }
`;
