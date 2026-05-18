import type { PropsWithChildren, RefObject } from 'react';
import type { Address } from 'viem';
import {
  Copy,
  ToastSuccess,
  External,
  Popover,
  Text,
  Link,
} from '@lidofinance/lido-ui';

import { useVaultRiskStatus } from 'modules/vaults';
import { truncateAddress } from 'utils';

import { AddressBadge } from './address-badge';
import { ButtonLink } from '../button-link';
import { AddressLinkEtherscan } from '../address-link-etherscan';
import { BannerWithoutTitle } from '../notice-container';

import {
  ActionGroup,
  ActionWrapper,
  PopoverContent,
  PopoverWrapper,
  StyledTooltip,
} from './styles';
import { NO_IDENTIFICATION_LINK } from '../banners';

type AddressPopoverProps = {
  address?: string;
  anchorRef: RefObject<HTMLDivElement>;
  isOpen: boolean;
  onClose?: () => void;
  mode: 'default' | 'hover';
  placement?: React.ComponentProps<typeof Popover>['placement'];
  showWarning?: boolean;
};

export const AddressPopover = ({
  anchorRef,
  address,
  onClose,
  isOpen,
  showWarning = false,
  children,
  mode = 'default',
  placement = 'topLeft',
}: PropsWithChildren<AddressPopoverProps>) => {
  const { isNodeOperatorVerified, isLoading } = useVaultRiskStatus();
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
      {showWarning && !isLoading && !isNodeOperatorVerified && (
        <BannerWithoutTitle>
          <Text size="xxs" color="warning">
            Operator has not passed the identification process.
          </Text>
          <Link href={NO_IDENTIFICATION_LINK}>Learn more</Link>
        </BannerWithoutTitle>
      )}
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
