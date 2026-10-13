import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const AfterDisconnectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const SupposedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media ${devicesHeaderMedia.mobile} {
    align-items: start;
    flex-direction: column;
  }
`;

export const WithdrawableTexts = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
