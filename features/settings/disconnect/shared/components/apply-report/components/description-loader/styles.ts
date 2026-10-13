import styled from 'styled-components';

export const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
