import { type FC, useCallback } from 'react';
import { PopupMenuItem } from '@lidofinance/lido-ui';

import type { ValidatorsEntry } from 'modules/vaults';

import { useValidatorModal } from 'features/validators/contexts';
import type { ValidatorsModalItem } from 'features/validators/types';

type ValidatorMenuActionProps = {
  label: string;
  modal: ValidatorsModalItem;
  validator: ValidatorsEntry;
  hasPermission: boolean;
  onPopupClose: () => void;
};

export const ValidatorMenuAction: FC<ValidatorMenuActionProps> = ({
  label,
  modal,
  validator,
  hasPermission,
  onPopupClose,
}) => {
  const { openModal } = useValidatorModal();

  const onCloseMenu = useCallback(() => {
    const { pubkey, balance, index } = validator;

    if (index === null) return;

    openModal({ currentModal: modal, balance, pubKey: pubkey, index });
    onPopupClose();
  }, [modal, onPopupClose, openModal, validator]);

  // `in_queue` validators have no index yet, so there is nothing to act on
  if (!hasPermission || validator.index === null) {
    return null;
  }

  return (
    <PopupMenuItem onClick={onCloseMenu} data-testid={`menu-action-${modal}`}>
      {label}
    </PopupMenuItem>
  );
};
