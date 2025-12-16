import { FC, useState, useRef, MouseEvent } from 'react';

import { Copy, External, ToastSuccess } from '@lidofinance/lido-ui';
import {
  AddressBadge,
  AddressBadgeProps,
  AddressLinkEtherscan,
  ButtonLink,
} from 'shared/components';

import {
  ActionGroup,
  ActionWrapper,
  PopoverContent,
  PopoverWrapper,
} from './styles';

import { truncateAddress } from 'utils';
import { Address } from 'viem';

export const AddressWithPopover: FC<AddressBadgeProps> = (props) => {
  const { address, onClick, bgColor, crossed } = props;
  const [showPopover, showPopoverVisibility] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleShowPopover = () => {
    showPopoverVisibility(true);
  };

  const handleCopyLink = () => {
    if (!address) return;
    void navigator.clipboard.writeText(address);
    ToastSuccess(`Address ${truncateAddress({ address })} have been copied`);
  };

  const handleClosePopover = () => {
    showPopoverVisibility(false);
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    handleShowPopover();
    onClick?.(event);
  };

  return (
    <>
      <AddressBadge
        ref={badgeRef}
        crossed={crossed}
        bgColor={bgColor}
        address={address}
        onClick={handleClick}
      />
      {!!badgeRef?.current && (
        <PopoverWrapper
          anchorRef={{
            current: badgeRef.current,
          }}
          backdrop
          offset="xs"
          onClose={handleClosePopover}
          placement="topLeft"
          open={showPopover}
        >
          <PopoverContent>
            <AddressBadge address={address} symbols={21} />
            <ActionGroup>
              <ActionWrapper>
                <Copy fill="var(--lido-color-primary)" />
                <ButtonLink onClick={handleCopyLink}>Copy address</ButtonLink>
              </ActionWrapper>
              <ActionWrapper>
                <External fill="var(--lido-color-primary)" />
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
