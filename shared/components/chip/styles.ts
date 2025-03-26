import styled from 'styled-components';
import { Chip, ChipVariants } from '@lidofinance/lido-ui';

const getColor = (color: ChipVariants) => {
  switch (color) {
    case 'positive':
      return 'var(--lido-color-success)';
    case 'negative':
      return 'var(--lido-color-error)';
    default:
      return 'var(--lido-color-success)';
  }
};

export const ChipStyled = styled(Chip)<{ variant: ChipVariants }>`
  padding: 0 ${({ theme }) => theme.spaceMap.xs}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  font-weight: 700;
  line-height: 20px;
  color: ${({ variant }) => getColor(variant)};
  background-color: color-mix(
    in srgb,
    ${({ variant }) => getColor(variant)} 10%,
    transparent
  );
`;
