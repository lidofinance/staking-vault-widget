import styled from 'styled-components';
import { Heading, Block } from '@lidofinance/lido-ui';
import { devicesHeaderMedia } from 'styles/global';

export const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Wrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.xl}px;
  background-color: ${({ theme }) => theme.colors.foreground};

  @media ${devicesHeaderMedia.tablet} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding-left: ${({ theme }) => theme.spaceMap.md}px;
`;
