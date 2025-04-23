import { MouseEvent, forwardRef, ForwardedRef } from 'react';

import { Identicon, TextColors, TextWeight } from '@lidofinance/lido-ui';
import { ButtonClose, ButtonRestore } from 'shared/components';
import { PillContainer, AddressText } from './styles';

export interface AddressBadgeProps {
  address: string | undefined;
  symbols?: number;
  crossedText?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success';
  onRemove?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRestore?: (event: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
}

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (
    {
      address,
      symbols = 6,
      crossedText = false,
      size = 'xs',
      color = 'default',
      weight = 700,
      bgColor = 'default',
      onRemove,
      onRestore,
      onClick,
    },
    ref?: ForwardedRef<HTMLDivElement>,
  ) => {
    if (!address) {
      return null;
    }

    return (
      <PillContainer bgColor={bgColor} onClick={onClick} ref={ref}>
        <Identicon address={address} />
        <AddressText
          size={size}
          color={color}
          weight={weight}
          symbols={symbols}
          address={address}
          crossedText={crossedText}
        />

        {!crossedText && onRemove && <ButtonClose onClick={onRemove} />}
        {crossedText && onRestore && <ButtonRestore onClick={onRestore} />}
      </PillContainer>
    );
  },
);
