import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const CookieWrapper = styled.div`
  grid-area: cookie;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const CookieText = styled(Text)`
  line-height: 20px;
  text-align: center;
  text-wrap-style: pretty;
`;
