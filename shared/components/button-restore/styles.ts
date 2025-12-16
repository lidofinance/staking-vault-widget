import styled from 'styled-components';

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
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
`;
