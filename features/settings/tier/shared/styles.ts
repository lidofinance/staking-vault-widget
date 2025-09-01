import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

export const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;
