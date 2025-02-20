import styled, { css } from 'styled-components';

import { Button, ButtonIcon, Container } from '@lidofinance/lido-ui';

export const PageWrapper = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 0;
`;

export const dashboardButton = css`
  padding: 20px 64px;
  box-shadow: none;

  &::before {
    border-color: ${({ theme }) => theme.colors.border};
  }

  &:hover:not(:disabled) {
    background-color: color-mix(
      in display-p3,
      ${({ theme }) => theme.colors.textSecondary} 12%,
      transparent
    );
  }

  &:hover span {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  & > span {
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: 1.7em;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const ConnectWalletButton = styled(Button)`
  ${dashboardButton}
`;

export const AddVaultButton = styled(ButtonIcon)`
  ${dashboardButton}
`;
