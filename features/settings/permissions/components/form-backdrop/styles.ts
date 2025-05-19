import styled from 'styled-components';

export const LoaderWrapper = styled.div`
  position: sticky;
  top: 20px;
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  width: fit-content;
  height: fit-content;
`;
