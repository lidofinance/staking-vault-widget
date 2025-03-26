import styled from 'styled-components';
import { Checkbox } from '@lidofinance/lido-ui';

export const CheckMint = styled(Checkbox)`
  & p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
