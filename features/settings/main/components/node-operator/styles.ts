import styled from 'styled-components';

import { Block } from '@lidofinance/lido-ui';

export const Wrapper = styled.div`
  padding: 12px;
  background-color: color-mix(
    in display-p3,
    var(--lido-color-popupMenuItemBgActiveHover) 4%,
    transparent
  );
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
`;

export const Content = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 0;
  background-color: transparent;
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;
