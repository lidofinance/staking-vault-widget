import styled from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
