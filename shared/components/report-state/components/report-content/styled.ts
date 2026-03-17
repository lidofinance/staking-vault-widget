import styled from 'styled-components';

export const Container = styled.aside`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 210px;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
`;
