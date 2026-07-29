import styled from 'styled-components';
import Link from 'next/link';

export const Container = styled(Link)`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  svg {
    fill: ${({ theme }) => theme.colors.textSecondary};
  }

  &:hover {
    span,
    svg {
      fill: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.secondary};
    }
  }

  &:visited,
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
    fill: ${({ theme }) => theme.colors.secondary};
  }
`;
