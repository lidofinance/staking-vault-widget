import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  cursor: pointer;

  svg {
    fill: ${({ theme }) => theme.colors.textSecondary};
  }

  &:hover {
    p,
    svg {
      fill: ${({ theme }) => theme.colors.secondary};
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;
