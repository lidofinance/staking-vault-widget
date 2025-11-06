import styled from 'styled-components';

export const ReindexStateContainer = styled.div`
  display: flex;
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-end;
  height: 21px;
  gap: 8px;
`;

export const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
