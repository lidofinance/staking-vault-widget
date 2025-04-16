import { FC, useState, useRef } from 'react';
import { Address } from 'viem';

import { Copy, External, ToastSuccess } from '@lidofinance/lido-ui';
import {
  AddressBadge,
  AddressLinkEtherscan,
  ButtonLink,
} from 'shared/components';

import {
  ActionGroup,
  ActionWrapper,
  PopoverContent,
  PopoverWrapper,
} from './styles';

import { truncateAddress } from 'utils/truncate-address';

export interface AddressItemProps {
  index: number;
  address: string;
  remove: (index: number) => void;
}

export const AddressItem: FC<AddressItemProps> = ({
  index,
  address,
  remove,
}) => {
  const [showPopover, showPopoverVisibility] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const handleShowPopover = () => {
    showPopoverVisibility(true);
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(address);
    ToastSuccess(`Address ${truncateAddress({ address })} have been copied`);
  };

  const handleClosePopover = () => {
    showPopoverVisibility(false);
  };

  return (
    <>
      <AddressBadge
        ref={badgeRef}
        address={address}
        onRemove={(e) => {
          e.preventDefault();
          e.stopPropagation();
          remove(index);
        }}
        onClick={handleShowPopover}
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
                <AddressLinkEtherscan address={address as Address} />
              </ActionWrapper>
            </ActionGroup>
          </PopoverContent>
        </PopoverWrapper>
      )}
    </>
  );
};
