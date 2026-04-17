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

  const onClose = useCallback(() => {
    const { pubkey, balance, index } = validator;

    openModal({ currentModal: modal, balance, pubKey: pubkey, index });
    onPopupClose();
  }, [modal, onPopupClose, openModal, validator]);

  if (!hasPermission) {
    return null;
  }

  return <PopupMenuItem onClick={onClose}>{label}</PopupMenuItem>;
};
