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

  label {
    & > span {
      padding: 9px 10px;
      border-radius: 40px;
      border: none;
      background-color: var(--lido-color-background);

      input {
        text-align: end;
        color: var(--lido-color-text);
      }
    }
  }
`;

export const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  z-index: 5;
  display: flex;
  justify-content: center;
  transform: translateY(-50%);
`;
