import styled, { css } from 'styled-components';
import { ArrowBottom } from '@lidofinance/lido-ui';

const headerCell = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  text-align: center;
  user-select: none;
`;

export const CommonHeader = styled.div`
  ${headerCell};
`;

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
