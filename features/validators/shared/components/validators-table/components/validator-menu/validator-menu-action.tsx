import { type FC, useCallback } from 'react';
import { PopupMenuItem } from '@lidofinance/lido-ui';

import { useValidatorModal } from 'features/validators/contexts';
import type { ValidatorsModalItem } from 'features/validators/types';

type ValidatorMenuActionProps = {
  label: string;
  modal: ValidatorsModalItem;
  hasPermission: boolean;
  onPopupClose: () => void;
};

export const ValidatorMenuAction: FC<ValidatorMenuActionProps> = ({
  label,
  modal,
  hasPermission,
  onPopupClose,
}) => {
  const { openModal } = useValidatorModal();

  const onClose = useCallback(() => {
    onPopupClose();
    openModal(modal);
  }, [modal, onPopupClose, openModal]);

  if (!hasPermission) {
    return null;
  }

  return <PopupMenuItem onClick={onClose}>{label}</PopupMenuItem>;
};
