import type { RefObject } from 'react';
import type { Address } from 'viem';

import { Copy, ToastSuccess, External, Popover } from '@lidofinance/lido-ui';

import { truncateAddress } from 'utils/truncate-address';
import { AddressBadge } from './address-badge';
import { ButtonLink } from '../button-link';
import { AddressLinkEtherscan } from '../address-link-etherscan';

import {
  ActionGroup,
  ActionWrapper,
  PopoverContent,
  PopoverWrapper,
} from './styles';

type AddressPopoverProps = {
  address?: string;
  anchorRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose?: () => void;
  placement?: React.ComponentProps<typeof Popover>['placement'];
};

export const AddressPopover = ({
  anchorRef,
  address,
  onClose,
  isOpen,
  placement = 'topLeft',
}: AddressPopoverProps) => {
  const handleCopy = () => {
    if (!address) return;
    void navigator.clipboard.writeText(address).then(() => {
      ToastSuccess(`Address ${truncateAddress({ address })} copied`);
    });
  };
  return (
    <PopoverWrapper
      anchorRef={anchorRef}
      open={isOpen}
      backdrop
      offset="xs"
      placement={placement}
      onClose={onClose}
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
            {address && <AddressLinkEtherscan address={address as Address} />}
          </ActionWrapper>
        </ActionGroup>
      </PopoverContent>
    </PopoverWrapper>
  );
};
