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
  crossedText?: boolean;
  bgColor?: BgColor;
} & Omit<TextProps, 'color' | 'size' | 'strong' | 'weight'>;

type PillProps = {
  theme: Theme;
  bgColor: BgColor;
};

type BgColor = 'transparent' | 'default' | 'error' | 'success' | 'active';

const getColorTransparency = (color: string, percent: string) => {
  return `color-mix(in display-p3, ${color} ${percent}, transparent)`;
};

const getBgColor = ({ theme: { colors }, bgColor }: PillProps) => {
  bgColor ??= 'default';
  const bgColorMap = {
    default: 'var(--lido-color-shadowLight)',
    transparent: 'transparent',
    error: getColorTransparency(colors.error, '20%'),
    success: getColorTransparency(colors.success, '30%'),
    active: getColorTransparency('var(--lido-color-textDark)', '12%'),
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

export const PillContainer = styled.div<PillProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
  padding: ${({ theme }) => theme.spaceMap.sm}px;
  padding-right: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: ${getBgColor};
  white-space: nowrap;
  text-wrap: nowrap;
`;

export const AddressText = styled(Address)<InjectedProps>`
  ${({ size, weight, crossedText }) => css`
    font-weight: ${weight};
    color: ${getTextColor};
    text-decoration: ${crossedText ? 'line-through' : 'none'};
    text-decoration-color: ${crossedText ? 'var(--lido-color-text)' : 'none'};
    ${sizes[size]}
  `}
`;
