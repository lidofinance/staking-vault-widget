import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 904px;
  margin: ${({ theme }) => theme.spaceMap.xl}px auto 0;
  padding: 0;
`;
