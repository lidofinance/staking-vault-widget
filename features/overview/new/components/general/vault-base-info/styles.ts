import styled from 'styled-components';
import { Address, Chip } from '@lidofinance/lido-ui';

export const Wrapper = styled.article`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
`;

export const NodeOperatorAddressWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const VaultAddress = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 700;
  line-height: 38px;
  color: ${({ theme }) => theme.colors.text};
`;

export const VaultContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
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

export const Tier = styled(Chip)`
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.primary};
`;

export const TierNotConnected = styled(Chip)`
  height: fit-content;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
`;

export const NodeOperatorAddress = styled(Address)`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  font-weight: 700;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};
`;
