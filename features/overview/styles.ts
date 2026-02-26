import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const OverviewContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 868px;
  margin: 0 auto;
`;

export const Content = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.xl}px;

  @media ${devicesHeaderMedia.tablet} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;

export const VaultAddressesWrapper = styled(Content)`
  gap: 12px 16px;
  max-width: 868px;
  margin: 28px auto 0;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  border-radius: 20px;

  @media ${devicesHeaderMedia.mobile} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;
