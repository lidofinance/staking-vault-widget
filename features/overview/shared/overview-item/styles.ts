import styled from 'styled-components';
import { Text, TextProps } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  row-gap: 8px;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: 'transparent';
  cursor: pointer;
  transition: background-color 0.1s ease;

  &:hover {
    background-color: ${({ theme }) =>
      theme.name === 'dark' ? '#2F2F36' : theme.colors.background};
  }

  @media ${devicesHeaderMedia.tablet} {
    padding: ${({ theme }) => theme.spaceMap.sm}px;
  }

  @media ${devicesHeaderMedia.mobile} {
    padding: 0;
  }
`;

export const DefaultContent = styled.div<{ titleView: 'column' | 'row' }>`
  display: flex;
  flex-direction: ${({ titleView }) => titleView};
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  align-items: ${({ titleView }) =>
    titleView === 'column' ? 'start' : 'center'};
  justify-content: space-between;
  width: 100%;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const LoaderWrapper = styled.div`
  padding-top: ${({ theme }) => theme.spaceMap.sm}px;
  padding-bottom: 10px;
`;

export const ContentText = styled(Text)<TextProps>`
  text-wrap: nowrap;
  @media ${devicesHeaderMedia.mobile} {
    font-size: ${({ size }) => (size === 'xl' ? 20 : 16)}px;
    line-height: ${({ size }) => (size === 'xl' ? 28 : 24)}px;
  }
`;
