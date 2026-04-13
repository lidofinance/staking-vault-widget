import styled from 'styled-components';

export const InfoContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.background};
`;

export const BaseInfo = styled.article`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const BalanceInfo = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const ParamContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PubKeyWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const BalanceRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
