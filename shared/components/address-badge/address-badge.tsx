import { MouseEvent, forwardRef, ForwardedRef } from 'react';

import {
  Identicon,
  Loader,
  TextColors,
  TextWeight,
} from '@lidofinance/lido-ui';
import { ButtonClose, ButtonRestore } from 'shared/components';
import { PillContainer, AddressText } from './styles';
import { zeroAddress } from 'viem';

export type AddressBadgeProps = {
  address?: string;
  symbols?: number;
  crossedText?: boolean;
  isActive?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
  readonly?: boolean;
  isLoading?: boolean;
  onToggle?: (event: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: MouseEvent<HTMLDivElement>) => void;
};

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (
    {
      address,
      symbols = 6,
      crossedText = false,
      isActive = false,
      size = 'xs',
      color = 'default',
      weight = 700,
      bgColor = 'default',
      onToggle,
      readonly,
      isLoading,
      onClick,
    },
    ref?: ForwardedRef<HTMLDivElement>,
  ) => {
    if (isLoading) {
      return (
        <PillContainer bgColor={bgColor} onClick={onClick} ref={ref}>
          <Identicon address={zeroAddress} />
          <Loader size="large" />
        </PillContainer>
      );
    }
    if (!address) {
      return null;
    }

    const containerBgColor = isActive ? 'active' : bgColor;

    return (
      <PillContainer bgColor={containerBgColor} onClick={onClick} ref={ref}>
        <Identicon address={address} />
        <AddressText
          size={size}
          color={color}
          weight={weight}
          symbols={symbols}
          address={address}
          crossedText={crossedText}
        />

        {!readonly && !crossedText && onToggle && (
          <ButtonClose onClick={onToggle} />
        )}
        {!readonly && crossedText && onToggle && (
          <ButtonRestore onClick={onToggle} />
        )}
      </PillContainer>
    );
  },
);
