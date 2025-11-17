import styled from 'styled-components';
import { Chip } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const BaseInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const TierLevel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const TierAmount = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
    align-items: start;
  }
`;

export const MintingLimit = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const MintingAvailable = styled.div`
  display: flex;
  align-items: center;
`;

export const ReserveRatio = styled(Chip)`
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  background: ${({ theme }) => theme.colors.foreground};
`;

export const TierStatus = styled(Chip)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.primary};
  background-color: color-mix(
    in display-p3,
    ${({ theme }) => theme.colors.primary} 20%,
    transparent
  );
`;
