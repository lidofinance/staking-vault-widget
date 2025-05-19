import { forwardRef, MouseEvent, useRef, useState } from 'react';
import {
  Identicon,
  Loader,
  TextColors,
  TextWeight,
} from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';
import { PillContainer, AddressText } from './styles';
import { AddressPopover } from './address-popover';

export type AddressBadgeProps = {
  address?: string;
  symbols?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
  crossed?: boolean;
  isLoading?: boolean;
  showPopover?: boolean;
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
      showPopover = false,
      ...props
    },
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLDivElement>(null);
    const ref = forwardedRef || backupRef;
    const [isOpen, setIsOpen] = useState(false);

    const onClick = showPopover
      ? (event: MouseEvent) => {
          setIsOpen(true);
          props.onClick?.(event);
        }
      : props.onClick;

    if (isLoading) {
      return (
        <PillContainer
          {...props}
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
      <>
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
        {showPopover && (
          <AddressPopover
            anchorRef={ref as any}
            isOpen={isOpen}
            address={address}
            onClose={() => setIsOpen(false)}
          />
        )}
      </>
    );
  },
);
