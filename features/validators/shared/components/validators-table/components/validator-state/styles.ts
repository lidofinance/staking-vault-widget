import styled from 'styled-components';
import { Text, Copy, Link } from '@lidofinance/lido-ui';

export const StateContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const CopyButton = styled.button`
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0;
  outline: none;
  border: none;
  background: transparent;
  cursor: pointer;
  appearance: none;

  &:hover svg {
    fill: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export const CopyIconStyled = styled(Copy)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.colors.secondary};
`;

export const TextStyled = styled(Text)`
  max-width: 104px;
  text-overflow: ellipsis;
  overflow: clip;
`;

export const LinkStyled = styled(Link)`
  display: flex;
  color: ${({ theme }) => theme.colors.secondary};

  &:visited {
    color: ${({ theme }) => theme.colors.secondary};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primaryHover};
  }
`;
