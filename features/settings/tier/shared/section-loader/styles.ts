import styled from 'styled-components';
import { InlineLoader } from '@lidofinance/lido-ui';

export const LoaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const InlineLoaderStyled = styled(InlineLoader)<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  border-radius: 10px;
`;
