import styled from 'styled-components';

export const ManageDepositsWrapper = styled.article`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  max-width: 436px;
  width: 100%;
  text-wrap: balance;
`;
