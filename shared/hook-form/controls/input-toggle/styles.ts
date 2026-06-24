import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

export type ToggleSize = 'xs' | 'md' | 'lg';

const getToggleSize = (size: ToggleSize = 'md') => {
  const height = { xs: 20, md: 24, lg: 28 }[size];
  const thumb = height - 4;
  const padding = 2;
  const width = height * 2 - 8;
  const translate = width - thumb - padding * 2;

  return { height, width, thumb, padding, translate };
};

export const Container = styled.div<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  flex-direction: ${({ $position }) =>
    $position === 'left' ? 'row' : 'row-reverse'};
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
`;

export const ToggleLoader = styled(InlineLoader)`
  width: 80px;
  height: 24px;
`;

export const InputWrapper = styled.label<{
  $disabled?: boolean;
  $size?: ToggleSize;
}>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ $size }) => getToggleSize($size).width}px;
  height: ${({ $size }) => getToggleSize($size).height}px;
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
    top: ${({ $size }) => getToggleSize($size).padding}px;
    left: ${({ $size }) => getToggleSize($size).padding}px;
    content: '';
    display: flex;
    width: ${({ $size }) => getToggleSize($size).thumb}px;
    height: ${({ $size }) => getToggleSize($size).thumb}px;
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
      transform: translateX(${({ $size }) => getToggleSize($size).translate}px);
    }
  }

  &:focus-within {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.65);
  }
`;
