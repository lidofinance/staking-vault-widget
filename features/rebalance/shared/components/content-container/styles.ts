import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: ${({ theme }) => theme.spaceMap.xxl}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: ${({ theme }) => theme.colors.foreground};
`;
