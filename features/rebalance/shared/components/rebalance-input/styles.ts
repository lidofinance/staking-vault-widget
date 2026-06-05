import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;
`;

export const TooltipAnchor = styled.div`
  width: 100%;
`;
