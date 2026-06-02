import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
    gap: 14px;
  }
`;

export const List = styled.ul`
  display: flex;
  list-style: none;
  gap: 20px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spaceMap.xs}px;
  }
`;
