import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

export const InlineLoaderStyled = styled(InlineLoader)<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: 10px;
`;
