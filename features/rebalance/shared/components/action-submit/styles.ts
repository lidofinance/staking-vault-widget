import styled from 'styled-components';

export const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  // keep the tooltip trigger hoverable even when the button is disabled
  pointer-events: auto;
`;
