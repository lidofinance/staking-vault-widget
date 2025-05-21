import { type MouseEvent, forwardRef, useRef, useState } from 'react';
import { zeroAddress } from 'viem';
import {
  Identicon,
  InlineLoader,
  TextColors,
  TextWeight,
  Tooltip,
} from '@lidofinance/lido-ui';

import { useSafeEnsName } from 'shared/hooks/use-safe-ens-name';
import { addressSchema } from 'utils/validate-form-value';

import { AddressAvatar } from './address-avatar';
import { AddressPopover } from './address-popover';
import { PillContainer, AddressText } from './styles';

export type AddressBadgeProps = {
  address?: string;
  showEnsName?: boolean;
  symbols?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
  crossed?: boolean;
  isLoading?: boolean;
  showPopover?: boolean;
  popoverPlacement?: React.ComponentProps<typeof Tooltip>['placement'];
  popoverMode?: 'default' | 'hover';
} & React.ComponentPropsWithRef<typeof PillContainer>;

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (
    {
      symbols = 6,
      size = 'xs',
      color = 'default',
      weight = 400,
      bgColor = 'default',
      crossed = false,
      isLoading = false,
      showPopover = false,
      showEnsName = false,
      popoverMode = 'default',
      popoverPlacement = 'topLeft',
      ...props
    },
    forwardedRef,
  ) => {
    const backupRef = useRef<HTMLDivElement>(null);
    const ref = forwardedRef || backupRef;
    const [isOpen, setIsOpen] = useState(false);
    const parsing = addressSchema.safeParse(props.address);

    const { ensName, isLoading: isEnsLoading } = useSafeEnsName(
      parsing.success && showEnsName ? parsing.data : undefined,
    );

    const onClick = (event: MouseEvent) => {
      setIsOpen(true);
      props.onClick?.(event);
    };

    if (isLoading || (showEnsName && isEnsLoading)) {
      return (
        <PillContainer
          crossed={crossed}
          bgColor={bgColor}
          onClick={onClick}
          ref={ref}
          {...props}
        >
          {/* if ens forced loading we can show right identicon */}
          <Identicon address={parsing.data ?? zeroAddress} />
          <InlineLoader style={{ width: 113 }} />
        </PillContainer>
      );
    }

    if (!parsing.success) return null;

    const address = parsing.data;
    const mainText = showEnsName && ensName ? ensName : address;

    const mainContent = (
      <PillContainer
        crossed={crossed}
        bgColor={bgColor}
        onClick={onClick}
        ref={ref}
        {...props}
      >
        <AddressAvatar address={address} ensName={ensName} />
        <AddressText
          size={size}
          color={color}
          weight={weight}
          symbols={symbols}
          address={mainText}
          crossedText={crossed}
        />
      </PillContainer>
    );

    if (showPopover) {
      return (
        <AddressPopover
          mode={popoverMode}
          anchorRef={ref as any}
          isOpen={isOpen}
          address={address}
          placement={popoverPlacement}
          onClose={() => setIsOpen(false)}
        >
          {mainContent}
        </AddressPopover>
      );
    }

    return mainContent;
  },
);
