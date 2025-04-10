import { MouseEvent, forwardRef, ForwardedRef } from 'react';

import { Identicon } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { PillContainer, AddressText } from './styles';

export interface AddressBadgeProps {
  address: string | undefined;
  symbols?: number;
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (props, ref?: ForwardedRef<HTMLDivElement>) => {
    const { address, symbols = 6, onRemove, onClick } = props;

    if (!address) {
      return null;
    }

    return (
      <PillContainer onClick={onClick} ref={ref}>
        <Identicon address={address} />
        <AddressText symbols={symbols} address={address} />

        {onRemove && <ButtonClose onClick={onRemove} />}
      </PillContainer>
    );
  },
);
