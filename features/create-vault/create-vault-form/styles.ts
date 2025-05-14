import styled from 'styled-components';
import { Block, H2 } from '@lidofinance/lido-ui';

export const FormBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;

export const FormTitle = styled(H2)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
`;

export const SectionContainer = styled.section<{
  isShown: boolean;
}>`
  display: ${({ isShown }) => (isShown ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
`;
