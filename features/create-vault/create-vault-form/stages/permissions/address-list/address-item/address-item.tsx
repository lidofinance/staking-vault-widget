import { FC, useState, useRef, useMemo, MouseEvent } from 'react';

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
import { useFormContext } from 'react-hook-form';
import { PermissionField, PermissionKeys } from 'features/create-vault/types';

export interface AddressItemProps {
  index: number;
  permission: PermissionKeys;
  field: PermissionField;
}

// TODO: use shared/components/AddressWithPopover component
export const AddressItem: FC<AddressItemProps> = ({
  index,
  permission,
  field,
}) => {
  const { setValue } = useFormContext();
  const { account, state } = field;
  const [showPopover, showPopoverVisibility] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);

  const isTextCrossed = state === 'restore';
  const bgColor = useMemo(() => {
    if (isTextCrossed) return 'error';
    if (state === 'grant') return 'success';
    return 'default';
  }, [isTextCrossed, state]);

  const handleUpdateFormItem = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    const newState = state === 'grant' ? 'restore' : 'grant';

    setValue(
      `roles.${permission}.${index}`,
      {
        account,
        state: newState,
      },
      { shouldDirty: true },
    );
  };

  const handleShowPopover = () => {
    showPopoverVisibility(true);
  };

  const handleCopyLink = () => {
    void navigator.clipboard.writeText(account);
    ToastSuccess(
      `Address ${truncateAddress({ address: account })} have been copied`,
    );
  };

  const handleClosePopover = () => {
    showPopoverVisibility(false);
  };

  return (
    <>
      <AddressBadge
        ref={badgeRef}
        crossedText={isTextCrossed}
        bgColor={bgColor}
        address={account}
        isActive={showPopover}
        onToggle={handleUpdateFormItem}
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
            <AddressBadge address={account} symbols={21} />
            <ActionGroup>
              <ActionWrapper>
                <Copy fill="var(--lido-color-primary)" />
                <ButtonLink onClick={handleCopyLink}>Copy address</ButtonLink>
              </ActionWrapper>
              <ActionWrapper>
                <External fill="var(--lido-color-primary)" />
                <AddressLinkEtherscan address={account} />
              </ActionWrapper>
            </ActionGroup>
          </PopoverContent>
        </PopoverWrapper>
      )}
    </>
  );
};
