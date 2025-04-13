import styled, { css } from 'styled-components';

import {
  Address,
  TextColors,
  TextProps,
  TextWeight,
  Theme,
} from '@lidofinance/lido-ui';

export const sizes = {
  xs: css`
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: 1.5em;
  `,
  sm: css`
    font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
    line-height: 1.5em;
  `,
  md: css`
    font-size: ${({ theme }) => theme.fontSizesMap.md}px;
    line-height: 1.5em;
  `,
  lg: css`
    font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
    line-height: 1.4em;
  `,
};

type InjectedProps = {
  size: 'xs' | 'sm' | 'md' | 'lg';
  weight: TextWeight;
  color: TextColors;
  theme: Theme;
} & Omit<TextProps, 'color' | 'size' | 'strong' | 'weight'>;

const getBgColor = (bgColor: 'transparent' | 'default') => {
  const bgColorMap = {
    default: 'var(--lido-color-shadowLight)',
    transparent: 'transparent',
  };

  return bgColorMap[bgColor];
};

const getTextColor = ({ theme: { colors }, color }: InjectedProps) => {
  const colorsMap = {
    default: colors.text,
    secondary: colors.textSecondary,
    primary: colors.primary,
    warning: colors.warning,
    error: colors.error,
    success: colors.success,
  };

  return colorsMap[color];
};

export const PillContainer = styled.div<{ bgColor: 'transparent' | 'default' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: ${({ bgColor }) => getBgColor(bgColor)};
  white-space: nowrap;
  text-wrap: nowrap;
`;

export const AddressText = styled(Address)<InjectedProps>`
  ${({ size, weight }) => css`
    font-weight: ${weight};
    color: ${getTextColor};
    ${sizes[size]}
  `}
`;
