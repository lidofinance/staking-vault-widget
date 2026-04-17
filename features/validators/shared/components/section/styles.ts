import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  background-color: ${({ theme }) => theme.colors.foreground};
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;

  @media ${devicesHeaderMedia.mobile} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;
