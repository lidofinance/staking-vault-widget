import styled from 'styled-components';

export const GroupWrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;
