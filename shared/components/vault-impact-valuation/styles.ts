import styled from 'styled-components';
import { ArrowBack } from '@lidofinance/lido-ui';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;
`;

export const ContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Valuation = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const Minted = styled.div`
  display: flex;
  align-items: center;
`;

export const ChipWrapper = styled.div`
  margin-left: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const ValuationMetric = styled.div`
  width: 100%;
  height: 16px;
  border-radius: 4px;
  background-color: #00a3ff;
`;

export const ArrowForward = styled(ArrowBack)`
  transform: rotate(180deg);
`;
