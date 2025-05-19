import styled from 'styled-components';
import { AddressBadge } from 'shared/components';

export { TextBold, ConfirmationLabel, ListItem } from '../styles';

export const ConfirmationAddressBadge = styled(AddressBadge).attrs({
  showPopover: true,
  bgColor: 'default',
})`
  grid-column: 2;
  justify-self: end;
  align-self: center;
`;
