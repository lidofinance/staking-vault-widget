import styled from 'styled-components';
import { Address } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const CurrentVaultWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  width: fit-content;
  margin: 0 0 ${({ theme }) => theme.spaceMap.lg}px;
  height: 52px;
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
