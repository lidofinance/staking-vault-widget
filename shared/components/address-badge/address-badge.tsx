import { forwardRef, MouseEventHandler } from 'react';
import {
  Identicon,
  Loader,
  TextColors,
  TextWeight,
} from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';
import { PillContainer, AddressText } from './styles';

export interface AddressBadgeProps {
  address?: string;
  symbols?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
  crossed?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (
    {
      address,
      symbols = 6,
      size = 'xs',
      color = 'default',
      weight = 700,
      bgColor = 'default',
      crossed = false,
      isLoading = false,
      onClick,
    },
    ref,
  ) => {
    if (isLoading) {
      return (
        <PillContainer
          crossed={crossed}
          bgColor={bgColor}
          onClick={onClick}
          ref={ref}
        >
          <Identicon address={zeroAddress} />
          <Loader size="large" />
        </PillContainer>
      );
    }

    if (!address) {
      return null;
    }

    return (
      <PillContainer
        crossed={crossed}
        bgColor={bgColor}
        onClick={onClick}
        ref={ref}
      >
        <Identicon address={address} />
        <AddressText
          size={size}
          color={color}
          weight={weight}
          symbols={symbols}
          address={address}
          crossedText={crossed}
        />
      </PillContainer>
    );
  },
);
