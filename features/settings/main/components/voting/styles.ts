import styled from 'styled-components';

export const VotingBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;
