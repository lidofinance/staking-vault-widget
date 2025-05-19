import styled, { css } from 'styled-components';

import {
  Address,
  Block,
  Popover,
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
  crossed?: boolean;
};

type BgColor = 'transparent' | 'default' | 'error' | 'success' | 'active';

const buildBgColorMap = (
  colors: PillProps['theme']['colors'],
  isHover?: boolean,
) => ({
  default: isHover
    ? 'var(--lido-color-shadowLight)'
    : getColorTransparency('var(--lido-color-shadowLight)', '12%'),
  transparent: 'transparent',
  error: getColorTransparency(colors.error, isHover ? '30%' : '20%'),
  success: getColorTransparency(colors.success, isHover ? '40%' : '30%'),
  active: getColorTransparency(
    'var(--lido-color-textDark)',
    isHover ? '15%' : '12%',
  ),
});

const getColorTransparency = (color: string, percent: string) => {
  return `color-mix(in display-p3, ${color} ${percent}, transparent)`;
};

const createBgGetter = (options: {
  considerCrossed: boolean;
  isHover?: boolean;
}) => {
  return ({
    theme: { colors },
    bgColor = 'default',
    crossed = false,
  }: PillProps) => {
    const map = buildBgColorMap(colors, options.isHover);
    const key: BgColor = options.considerCrossed && crossed ? 'error' : bgColor;
    return map[key];
  };
};

const getBgColor = createBgGetter({ considerCrossed: true });
const getBgColorHover = createBgGetter({
  considerCrossed: true,
  isHover: true,
});
const getPillBgColor = createBgGetter({ considerCrossed: false });

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
  background-color: ${getPillBgColor};
  white-space: nowrap;
  text-wrap: nowrap;
  cursor: ${({ onClick }) => (onClick ? 'pointer' : 'default')};
  ${({ onClick }) =>
    onClick
      ? css`
          &:hover {
            background-color: ${getBgColorHover};
          }
        `
      : ''};
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

export const SelectableWrapper = styled.div<PillProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: fit-content;
  padding-right: ${({ theme }) => theme.spaceMap.sm}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: ${getBgColor};
`;

export const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(
    in srgb,
    var(--lido-color-textSecondary) 20%,
    transparent
  );
  cursor: pointer;
`;

export const HiddenCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`;

export const PopoverWrapper = styled(Popover)`
  padding: ${({ theme }) => theme.spaceMap.md}px;
`;

export const PopoverContent = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 0;
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
