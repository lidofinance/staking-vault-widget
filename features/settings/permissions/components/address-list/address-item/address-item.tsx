import { FC, useState, useRef, useMemo, MouseEvent } from 'react';

import { Popover, Copy, External, ToastSuccess } from '@lidofinance/lido-ui';
import {
  AddressBadge,
  AddressLinkEtherscan,
  ButtonLink,
} from 'shared/components';

import { ActionGroup, ActionWrapper, PopoverContent } from './styles';

import { truncateAddress } from 'utils/truncate-address';
import {
  FieldSchema,
  PermissionsKeys,
} from 'features/settings/permissions/types';
import { useFormContext } from 'react-hook-form';

export interface AddressItemProps {
  index: number;
  field: FieldSchema;
  permission: PermissionsKeys;
}

export const AddressItem: FC<AddressItemProps> = ({
  index,
  field,
  permission,
}) => {
  const { setValue } = useFormContext();
  const { account, state, group } = field;
  const [showPopover, showPopoverVisibility] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const isTextCrossed = useMemo(
    () => ['restore', 'remove'].includes(state),
    [state],
  );
  const bgColor = useMemo(() => {
    if (isTextCrossed) return 'error';
    if (state === 'grant') return 'success';
    return 'default';
  }, [isTextCrossed, state]);

  const handleUpdateFormItem = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();

    let newState;
    if (group === 'settled') {
      newState = state === 'display' ? 'remove' : 'display';
    } else {
      newState = state === 'grant' ? 'restore' : 'grant';
    }

    setValue(
      `${permission}.${index}`,
      {
        account,
        group,
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
        address={account}
        crossedText={isTextCrossed}
        bgColor={bgColor}
        onRemove={handleUpdateFormItem}
        onRestore={handleUpdateFormItem}
        onClick={handleShowPopover}
      />
      {!!badgeRef?.current && (
        <Popover
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
        </Popover>
      )}
    </>
  );
};
