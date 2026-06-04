import styled from 'styled-components';

export const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  pointer-events: auto;
`;
