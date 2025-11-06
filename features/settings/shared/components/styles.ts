import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  width: 100%;
`;

export const ContentWrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: clip;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  width: 100%;
`;
