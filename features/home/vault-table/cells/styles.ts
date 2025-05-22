import styled from 'styled-components';

export const Percent = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 700;
`;
