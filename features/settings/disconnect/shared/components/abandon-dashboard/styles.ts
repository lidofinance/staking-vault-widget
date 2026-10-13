import styled from 'styled-components';

export const AbandonContainer = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
`;
