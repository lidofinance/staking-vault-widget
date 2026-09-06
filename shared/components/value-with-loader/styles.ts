import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

import { isNumber } from 'utils';

const getCssSize = (size: number | `${number}px` | `${number}%`) => {
  if (isNumber(size)) {
    return `${size}px`;
  }

  return size;
};

export const InlineLoaderStyled = styled(InlineLoader)<{
  width?: number | `${number}px` | `${number}%`;
  height?: number | `${number}px` | `${number}%`;
}>`
  width: ${({ width }) => (width ? getCssSize(width) : '100%')};
  height: ${({ height }) => (height ? getCssSize(height) : 'unset')};
`;

export const CircleLoaderContainer = styled.div<{
  width?: number | `${number}px` | `${number}%`;
  height?: number | `${number}px` | `${number}%`;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => (width ? getCssSize(width) : '100%')};
  height: ${({ height }) => (height ? getCssSize(height) : '100%')};
`;
