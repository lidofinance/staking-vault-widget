import styled from 'styled-components';

export const AllVaultsWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
