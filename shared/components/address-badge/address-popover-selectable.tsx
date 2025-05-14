import React, { FC, useRef, useState } from 'react';
import { Copy, External, ToastSuccess } from '@lidofinance/lido-ui';
import { AddressBadge, AddressBadgeProps } from './address-badge';
import {
  AddressBadgeSelectable,
  AddressLinkEtherscan,
  ButtonLink,
} from 'shared/components';
import {
  PopoverWrapper,
  PopoverContent,
  ActionGroup,
  ActionWrapper,
} from './styles';
import { truncateAddress } from 'utils/truncate-address';
import { Address } from 'viem';

export type AddressPopoverSelectableProps = Pick<
  AddressBadgeProps,
  'address' | 'symbols' | 'size' | 'color' | 'weight' | 'bgColor' | 'isLoading'
> & {
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const AddressPopoverSelectable: FC<AddressPopoverSelectableProps> = ({
  address,
  symbols,
  size,
  color,
  weight,
  bgColor,
  checked,
  isLoading,
  placement = 'topLeft',
  onCheckedChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleBadgeToggle = () => {
    setOpen(!open);
  };

  const handleCopy = () => {
    if (!address) return;
    void navigator.clipboard.writeText(address);
    ToastSuccess(`Address ${truncateAddress({ address })} copied`);
  };

  return (
    <>
      <AddressBadgeSelectable
        ref={ref}
        address={address}
        symbols={symbols}
        size={size}
        color={color}
        weight={weight}
        defaultBg={bgColor}
        checked={checked}
        isLoading={isLoading}
        onCheckedChange={onCheckedChange}
        onClick={handleBadgeToggle}
      />

      {ref.current && (
        <PopoverWrapper
          anchorRef={ref}
          open={open}
          backdrop
          offset="xs"
          placement={placement}
          onClose={handleBadgeToggle}
        >
          <PopoverContent>
            <AddressBadge address={address} symbols={21} />

            <ActionGroup>
              <ActionWrapper>
                <Copy />
                <ButtonLink onClick={handleCopy}>Copy address</ButtonLink>
              </ActionWrapper>

              <ActionWrapper>
                <External />
                {address && (
                  <AddressLinkEtherscan address={address as Address} />
                )}
              </ActionWrapper>
            </ActionGroup>
          </PopoverContent>
        </PopoverWrapper>
      )}
    </>
  );
};
