import styled from 'styled-components';
import { Text, Copy } from '@lidofinance/lido-ui';

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

  svg {
    fill: ${({ theme }) => theme.colors.textSecondary};
  }

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
