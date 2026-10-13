import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ActionButton = styled(Button)`
  padding: 6px 16px;
  line-height: 20px;
  background-color: ${({ theme }) => theme.colors.foreground};
`;
