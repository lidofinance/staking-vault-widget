import styled from 'styled-components';

export const Wrapper = styled.article`
  display: flex;
  align-items: start;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const InfoList = styled.ul`
  list-style-position: inside;
`;
