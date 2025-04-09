import styled from 'styled-components';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AmountInfo = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  color: ${({ theme }) => theme.colors.text};
`;
