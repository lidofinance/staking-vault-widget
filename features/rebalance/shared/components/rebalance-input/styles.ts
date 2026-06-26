import Link from 'next/link';
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;
`;

export const TooltipAnchor = styled.div`
  width: 100%;
`;

export const InlineLink = styled(Link)`
  color: inherit;
  text-decoration: underline;

  &:visited {
    color: inherit;
  }
`;
