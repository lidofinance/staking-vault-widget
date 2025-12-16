import styled from 'styled-components';

export const Percent = styled.span<{ color?: string; strong?: boolean }>`
  ${({ color }) => (color ? `color: ${color};` : '')};
  ${({ strong }) => (strong ? 'font-weight: 700;' : '')};
`;
