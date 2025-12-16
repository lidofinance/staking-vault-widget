import styled from 'styled-components';

export const Button = styled.button`
  color: var(--lido-color-primary);
  text-decoration: none;
  cursor: pointer;
  transition: color 0.2s ease;
  background-color: transparent;
  border: none;
  padding: 0;
  font: inherit;

  &:hover {
    color: color-mix(in srgb, var(--lido-color-primary) 60%, transparent);
    text-decoration: none;
    border: none;
    outline: none;
  }

  &:visited {
    color: color-mix(
      in srgb,
      var(--lido-color-primary),
      var(--lido-color-text)
    );
  }

  &:focus {
    outline: 1px solid var(--lido-color-primary);
    outline-offset: 2px;
    border: none;
    outline: none;
  }

  &:active {
    color: var(--lido-color-errorHover);
    border: none;
    outline: none;
  }
`;
