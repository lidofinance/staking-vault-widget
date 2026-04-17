import styled from 'styled-components';

export const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  padding: 54px 0;
  width: 100%;
`;
