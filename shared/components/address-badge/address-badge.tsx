import { FC, MouseEvent } from 'react';
import { Close, Identicon } from '@lidofinance/lido-ui';
import { PillContainer, AddressText, CloseButton } from './styles';

export interface AddressBadgeProps {
  address: string;
  symbols?: number;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const AddressBadge: FC<AddressBadgeProps> = (props) => {
  const { address, symbols = 6, onClick } = props;
  return (
    <PillContainer>
      <Identicon address={address} />
      <AddressText symbols={symbols} address={address} />

      {onClick && (
        <CloseButton size="xs" onClick={onClick}>
          <Close />
        </CloseButton>
      )}
    </PillContainer>
  );
};
