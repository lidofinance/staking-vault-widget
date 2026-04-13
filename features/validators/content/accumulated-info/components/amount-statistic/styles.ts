import styled from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
