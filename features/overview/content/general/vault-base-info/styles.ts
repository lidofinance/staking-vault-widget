import styled from 'styled-components';
import { Address } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const Wrapper = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media ${devicesHeaderMedia.tablet} {
    flex-direction: column;
    align-items: start;
    gap: ${({ theme }) => theme.spaceMap.lg}px;
  }
`;

export const NodeOperatorContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const NodeOperatorParameter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  @media ${devicesHeaderMedia.tablet} {
    align-items: start;
  }
`;

export const NodeOperatorAddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  cursor: pointer;
`;

export const VaultAddress = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
  line-height: 38px;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;

  @media ${devicesHeaderMedia.mobile} {
    font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
    line-height: 28px;
  }
`;

export const VaultContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  align-items: center;
`;

export const VaultBaseInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const VaultAddressAndTier = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const VaultRR = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const NodeOperatorAddress = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
