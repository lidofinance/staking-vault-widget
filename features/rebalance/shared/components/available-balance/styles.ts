import styled from 'styled-components';

export const AvailableWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
`;
