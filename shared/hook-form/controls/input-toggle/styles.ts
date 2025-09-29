import styled from 'styled-components';

export const Container = styled.div<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  flex-direction: ${({ $position }) =>
    $position === 'left' ? 'row' : 'row-reverse'};
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
`;

export const InputWrapper = styled.label<{ $disabled?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  width: 40px;
  height: 24px;
  border-radius: 99px;
  background-color: ${({ theme }) => theme.colors.accentBorder};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  transition: background-color 160ms ease;
  outline: none;

  & > input[type='checkbox'] {
    display: none;
  }

  &::before {
    position: absolute;
    top: 2px;
    left: 2px;
    content: '';
    display: flex;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.foreground};
    transform: translateX(0);
    transition:
      transform 100ms ease,
      background-color 100ms ease,
      box-shadow 100ms ease;
    will-change: transform;
  }

  &:has(input[type='checkbox']:checked) {
    background-color: ${({ theme }) => theme.colors.primary};

    &::before {
      transform: translateX(16px);
    }
  }

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.65);
  }
`;
