import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const InlineLoaderStyled = styled(InlineLoader)<{
  width?: number;
  height?: number;
}>`
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  height: ${({ height }) => (height ? `${height}px` : 'unset')};
`;
