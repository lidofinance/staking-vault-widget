import styled, { css } from 'styled-components';
import { Button, ButtonIcon } from '@lidofinance/lido-ui';

export const dashboardButton = css`
  width: 100%;
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
    line-height: 24px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const ConnectWalletButton = styled(Button)`
  ${dashboardButton}
`;

export const AddVaultButton = styled(ButtonIcon)`
  ${dashboardButton}
`;
