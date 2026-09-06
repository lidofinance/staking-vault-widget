import styled from 'styled-components';

export const WithdrawContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
`;
