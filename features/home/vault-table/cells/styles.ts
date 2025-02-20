import styled, { DefaultTheme } from 'styled-components';

const getColorByValue = (theme: DefaultTheme, value: number) => {
  const percent = value * 100;
  if (percent >= 100) return theme.colors.success;
  if (percent >= 90) return theme.colors.warning;
  if (percent < 90) return theme.colors.error;
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
