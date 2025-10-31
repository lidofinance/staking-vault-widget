import { InlineLoader } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const InlineLoaderStyled = styled(InlineLoader)<{ width?: string }>`
  width: ${({ width }) => `${width}px` || '80px'};
`;
