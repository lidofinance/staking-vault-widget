import styled from 'styled-components';
import { Block, H2 } from '@lidofinance/lido-ui';

export const Wrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;

export const TitleContainer = styled.header`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const Title = styled(H2)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
`;
