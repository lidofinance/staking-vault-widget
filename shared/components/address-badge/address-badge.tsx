import { forwardRef, MouseEvent } from 'react';
import {
  Identicon,
  Loader,
  TextColors,
  TextWeight,
} from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';
import { PillContainer, AddressText } from './styles';

export type AddressBadgeProps = {
  address?: string;
  symbols?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
  crossed?: boolean;
  isLoading?: boolean;
  onToggle?: (event: MouseEvent<HTMLButtonElement>) => void;
} & React.ComponentPropsWithRef<typeof PillContainer>;

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (
    {
      address,
      symbols = 6,
      size = 'xs',
      color = 'default',
      weight = 400,
      bgColor = 'default',
      crossed = false,
      isLoading = false,
      onClick,

      ...props
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
        {...props}
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
