import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
