import styled from 'styled-components';

export const DisconnectPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;
