import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;
