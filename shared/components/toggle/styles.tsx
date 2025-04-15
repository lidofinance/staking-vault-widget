import styled, { keyframes } from 'styled-components';

const moveBackground = (
  activeIndexWidth: number,
  prevElementWidth: number,
  positionDiff: number,
  prevPositionX: number,
) => keyframes`
  0% {
    transform: translateX(${prevPositionX}px);
    width: ${prevElementWidth}px;
  }
  100% {
    transform: translateX(${positionDiff}px);
    width: ${activeIndexWidth - 4}px;
  }
`;

export const ToggleContainer = styled.ul<{
  activeIndexWidth: number;
  prevElementWidth: number;
  positionDiff: number;
  prevPositionX: number;
}>`
  position: relative;
  display: flex;
  width: fit-content;
  height: 44px;
  border-radius: 100px;
  background-color: var(--lido-color-backgroundDarken);
  list-style-type: none;

  &:before {
    content: '';
    position: absolute;
    padding: 8px 24px;
    top: 2px;
    left: 2px;
    width: ${({ activeIndexWidth }) => activeIndexWidth - 4}px;
    height: 40px;
    background-color: var(--lido-color-foreground);
    border-radius: 100px;
    animation: ${({
        activeIndexWidth,
        prevElementWidth,
        positionDiff,
        prevPositionX,
      }) =>
        moveBackground(
          activeIndexWidth,
          prevElementWidth,
          positionDiff,
          prevPositionX,
        )}
      0.5s ease forwards;
  }
`;

export const ToggleOption = styled.li<{ isActive: boolean }>`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 24px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  color: var(--lido-color-text);
  opacity: ${(props) => (props.isActive ? 1 : 0.3)};
  cursor: pointer;
  transition: opacity 0.3s;

  &:hover {
    opacity: 1;
  }
`;
