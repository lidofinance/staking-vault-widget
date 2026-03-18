import styled from 'styled-components';
import { H2, Block } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const VaultAddressesWrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  max-width: 868px;
  width: 100%;
  margin: 28px auto 0;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  border-radius: 20px;

  @media ${devicesHeaderMedia.tablet} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const Content = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;

  @media ${devicesHeaderMedia.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const Title = styled(H2)`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: 24px;
`;
