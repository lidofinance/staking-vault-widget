import styled from 'styled-components';
import { Td } from '@lidofinance/lido-ui';

export const TdStyled = styled(Td)`
  padding: 18px 12px;

  &:first-child {
    padding-left: 0 !important;
  }

  &:last-child {
    padding-right: 0 !important;
  }
`;
