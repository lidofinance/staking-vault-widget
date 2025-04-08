import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  margin: ${({ theme }) => theme.spaceMap.md}px 0 0;
  height: 32px;
  border-radius: 40px;
  border: 1px solid var(--lido-color-accentBorderHover);
  background-color: var(--lido-color-background);
  overflow: clip;
`;
