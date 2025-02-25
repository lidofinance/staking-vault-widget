import styled, { DefaultTheme } from 'styled-components';
import {
  VAULT_GREEN_HEATH_PERCENT,
  VAULT_YELLOW_HEATH_PERCENT,
  VAULT_RED_HEATH_PERCENT,
} from 'consts/threshold';

const getColorByValue = (theme: DefaultTheme, value: number) => {
  const percent = value * 100;
  if (percent >= VAULT_GREEN_HEATH_PERCENT) return theme.colors.success;
  if (percent >= VAULT_YELLOW_HEATH_PERCENT) return theme.colors.warning;
  if (percent <= VAULT_RED_HEATH_PERCENT) return theme.colors.error;
  return theme.colors.text;
};

export const Mintable = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Percent = styled.span<{ value: number }>`
  color: ${({ theme, value }) => getColorByValue(theme, value)};
  font-weight: 700;
`;

export const AddressWrapper = styled.div`
  cursor: pointer;
`;
