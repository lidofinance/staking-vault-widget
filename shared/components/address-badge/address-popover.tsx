import type { PropsWithChildren, RefObject, FC, ReactNode } from 'react';
import type { Address } from 'viem';
import { Copy, ToastSuccess, External, Popover } from '@lidofinance/lido-ui';

import { truncateAddress } from 'utils';

import { AddressBadge } from './address-badge';
import { ButtonLink } from '../button-link';
import { AddressLinkEtherscan } from '../address-link-etherscan';

import {
  ActionGroup,
  ActionWrapper,
  PopoverContent,
  PopoverWrapper,
  StyledTooltip,
} from './styles';

type AddressPopoverProps = {
  address?: string;
  anchorRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose?: () => void;
  mode: 'default' | 'hover';
  placement?: React.ComponentProps<typeof Popover>['placement'];
  contentChildren?: ReactNode;
};

export const AddressPopover: FC<PropsWithChildren<AddressPopoverProps>> = ({
  anchorRef,
  address,
  onClose,
  isOpen,
  children,
  contentChildren,
  mode = 'default',
  placement = 'topLeft',
}) => {
  const handleCopy = () => {
    if (!address) return;
    void navigator.clipboard.writeText(address).then(() => {
      ToastSuccess(`Address ${truncateAddress({ address })} copied`);
    });
  };

  const popoverContent = (
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
      {contentChildren}
    </PopoverContent>
  );

  if (mode === 'hover') {
    return (
      <StyledTooltip
        onClick={(e) => {
          e.stopPropagation();
        }}
        offset="xs"
        placement={placement}
        title={popoverContent}
      >
        {children as any}
      </StyledTooltip>
    );
  }

  return (
    <>
      {children}
      <PopoverWrapper
        anchorRef={anchorRef}
        open={isOpen}
        backdrop
        offset="xs"
        placement={placement}
        onClose={onClose}
      >
        {popoverContent}
      </PopoverWrapper>
    </>
  );
};
