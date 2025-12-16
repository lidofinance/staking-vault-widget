import { type MouseEvent, forwardRef, useRef, useState } from 'react';
import { zeroAddress } from 'viem';
import {
  Identicon,
  TextColors,
  TextWeight,
  Tooltip,
} from '@lidofinance/lido-ui';

import { useSafeEnsName } from 'shared/hooks/use-safe-ens-name';
import { addressSchema } from 'utils/zod-validation';
import { InlineLoader } from 'shared/components';

import { AddressAvatar } from './address-avatar';
import { AddressPopover } from './address-popover';
import { PillContainer, AddressText } from './styles';

export type AddressBadgeProps = {
  // display
  address?: string;
  showEnsName?: boolean;
  showPopover?: boolean | 'default' | 'hover';
  popoverPlacement?: React.ComponentProps<typeof Tooltip>['placement'];
  // state
  isLoading?: boolean;
  // style
  symbols?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  hoverEffect?: boolean;
  dataTestId?: string;
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
      hoverEffect = true,
      popoverPlacement = 'topLeft',
      dataTestId,
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
          <InlineLoader width={113} isLoading />
        </PillContainer>
      );
    }

    if (!parsing.success) return null;

    const address = parsing.data;
    const mainText = showEnsName && ensName ? ensName : address;

    const mainContent = (
      <PillContainer
        ref={ref}
        crossed={crossed}
        bgColor={bgColor}
        onClick={onClick}
        hoverEffect={hoverEffect}
        data-testid={dataTestId ? `${dataTestId}-pillContainer` : undefined}
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
          data-testid={dataTestId ? `${dataTestId}-addressText` : undefined}
        />
      </PillContainer>
    );

    const popoverMode =
      typeof showPopover === 'boolean' ? 'default' : showPopover;

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
