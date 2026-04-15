import { useMemo } from 'react';

import { vaultTexts } from 'modules/vaults';

import type { ValidatorsModalItem } from 'features/validators/types';
import { VALIDATOR_MODALS } from 'features/validators/const';
import { useValidators } from 'features/validators/contexts';

type ValidatorMenuActionItem = {
  hasPermission: boolean;
  label: string;
  modal: ValidatorsModalItem;
};

const { topUpValidator, partialWithdrawal, withdrawToStVault } =
  vaultTexts.actions.validators.table.menu;

export const useValidatorMenuActions = () => {
  const { isAdmin, hasDepositorPermission, hasWithdrawalPermission } =
    useValidators();

  return useMemo<ValidatorMenuActionItem[]>(
    () => [
      {
        hasPermission: hasDepositorPermission,
        label: topUpValidator,
        modal: VALIDATOR_MODALS.topUpValidator,
      },
      {
        hasPermission: isAdmin || hasWithdrawalPermission,
        label: partialWithdrawal,
        modal: VALIDATOR_MODALS.partialWithdrawal,
      },
      {
        hasPermission: isAdmin || hasWithdrawalPermission,
        label: withdrawToStVault,
        modal: VALIDATOR_MODALS.fullWithdrawal,
      },
    ],
    [isAdmin, hasDepositorPermission, hasWithdrawalPermission],
  );
};
