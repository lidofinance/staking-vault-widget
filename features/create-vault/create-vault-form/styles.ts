import styled from 'styled-components';
import { Block, Button, H2 } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const FormBlock = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
`;

export const FormSubtitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  font-weight: 700;
`;

export const FormTitle = styled(H2)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  font-weight: 700;
`;

export const ActionButton = styled(Button)`
  padding-inline: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const ActionButtonContainer = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;

  & > button {
    flex: 1 1 50% !important;
  }

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;

export const SectionContainer = styled.section<{
  isShown: boolean;
}>`
  display: ${({ isShown }) => (isShown ? 'flex' : 'none')};
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xxl}px;
  width: 100%;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;

  & > a {
    text-align: center;
  }
`;
