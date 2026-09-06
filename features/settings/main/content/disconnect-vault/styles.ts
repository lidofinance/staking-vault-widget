import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const BadgeWrapper = styled.div`
  width: fit-content;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
