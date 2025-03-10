import styled from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  gap: 8px;
  width: calc(100% - 32px);
  align-items: center;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(
    in srgb,
    var(--lido-color-textSecondary) 20%,
    transparent
  );
  border: none;
  cursor: pointer;
  outline: none;
  box-shadow: none;
  appearance: none;

  & svg {
    fill: var(--lido-color-text);
  }
`;
