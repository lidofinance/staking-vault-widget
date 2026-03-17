import styled from 'styled-components';
import { Address } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const CurrentVaultWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  width: fit-content;
  margin: ${({ theme }) => theme.spaceMap.md}px 0 0;
  background-color: ${({ theme }) => theme.colors.background};
  overflow: clip;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

export const AddressStyled = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  font-weight: 700;
  line-height: 24px;
`;
