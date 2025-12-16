import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const BannerWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  background-color: #000;
  text-wrap: balance;
  text-align: center;
`;

export const TextWhite = styled(Text)`
  color: ${({ theme }) => theme.colors.accentContrast};
`;
