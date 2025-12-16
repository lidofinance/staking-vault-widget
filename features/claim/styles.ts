import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  max-width: 600px;
  margin: ${({ theme }) => theme.spaceMap.md}px auto 0;
  padding: 0;
`;
