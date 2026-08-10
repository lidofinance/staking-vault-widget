import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const AvailabilityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const PreparationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const AvailabilityItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    align-items: start;
    flex-direction: column;
    gap: ${({ theme }) => theme.spaceMap.sm}px;
  }
`;
