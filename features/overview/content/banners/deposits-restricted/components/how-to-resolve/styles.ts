import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spaceMap.md}px;
`;
