import styled from 'styled-components';
import { Button, Text } from '@lidofinance/lido-ui';

export const BannerContainer = styled.div`
  display: contents;
`;

export const TextStyled = styled(Text)`
  line-height: 20px;
`;

export const ApplyButton = styled(Button)`
  padding: 6px 16px;
  line-height: 20px;
  background-color: ${({ theme }) => theme.colors.foreground};
`;
