import styled from 'styled-components';
import { ArrowBottom } from '@lidofinance/lido-ui';

export const Percent = styled.span<{ color: string }>`
  color: ${({ color }) => color};
  font-weight: 700;
`;

export const ArrowAnimated = styled(ArrowBottom)<{
  isActive?: boolean;
  direction?: 'asc' | 'desc' | 'none';
}>`
  transition: transform 0.2s ease-in-out;
  transform: ${({ direction }) =>
    direction === 'desc' ? 'rotate(180deg)' : 'none'};
`;
