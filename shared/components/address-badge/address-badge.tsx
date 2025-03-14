import { FC, MouseEvent } from 'react';

import { Identicon } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { PillContainer, AddressText } from './styles';

export interface AddressBadgeProps {
  address: string;
  symbols?: number;
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export const AddressBadge: FC<AddressBadgeProps> = (props) => {
  const { address, symbols = 6, onRemove } = props;

  return (
    <PillContainer>
      <Identicon address={address} />
      <AddressText symbols={symbols} address={address} />

      {onRemove && <ButtonClose onClick={onRemove} />}
    </PillContainer>
  );
};
