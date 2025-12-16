import styled from 'styled-components';

export const Container = styled.article`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;
