import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const InlineLoaderStyled = styled(InlineLoader)<{
  width?: number;
  height?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : 'unset')};
`;

export const CircleLoaderContainer = styled.div<{
  width?: `${number}px` | `${number}%`;
  height?: `${number}px` | `${number}%`;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ width }) => (width ? width : '100%')};
  height: ${({ height }) => (height ? height : '100%')};
`;
