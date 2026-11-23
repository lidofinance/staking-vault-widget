import styled from 'styled-components';
import { Tooltip, Address } from '@lidofinance/lido-ui';

export const TooltipStyled = styled(Tooltip)`
  overflow: clip;
`;

export const AddressStyled = styled(Address)`
  user-select: none;
  cursor: help;
`;
