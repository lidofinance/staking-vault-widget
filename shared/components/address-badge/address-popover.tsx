import type { PropsWithChildren, RefObject } from 'react';
import type { Address } from 'viem';

import {
  Copy,
  ToastSuccess,
  External,
  Popover,
  Tooltip,
} from '@lidofinance/lido-ui';

import { truncateAddress } from 'utils';
import { AddressBadge } from './address-badge';
import { ButtonLink } from '../button-link';
import { AddressLinkEtherscan } from '../address-link-etherscan';

import {
  ActionGroup,
  ActionWrapper,
  PopoverContent,
  PopoverWrapper,
} from './styles';
import styled from 'styled-components';

type AddressPopoverProps = {
  address?: string;
  anchorRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose?: () => void;
  mode: 'default' | 'hover';
  placement?: React.ComponentProps<typeof Popover>['placement'];
};

const StyledTooltip = styled(Tooltip)`
  && {
    background: var(--lido-color-foreground);
    box-shadow: ${({ theme }) => theme.boxShadows.xs}
      var(--lido-color-shadowLight);
    padding: ${({ theme }) => theme.spaceMap.md}px;
    max-width: unset !important;

    opacity: 0;
    pointer-events: none;
    animation: fadeIn 0.1s ease-in forwards;
    animation-delay: 0.6s;

    @keyframes fadeIn {
      to {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
`;

export const AddressPopover = ({
  anchorRef,
  address,
  onClose,
  isOpen,
  children,
  mode = 'default',
  placement = 'topLeft',
}: PropsWithChildren<AddressPopoverProps>) => {
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
