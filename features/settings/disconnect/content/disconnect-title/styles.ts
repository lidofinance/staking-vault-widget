import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const TitleHeading = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;
