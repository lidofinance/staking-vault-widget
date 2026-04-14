import { useMemo } from 'react';

import { vaultTexts } from 'modules/vaults';

import type { ValidatorsModalItem } from 'features/validators/types';
import { VALIDATOR_MODALS } from 'features/validators/const';
import { useShowTableMenu } from './use-show-table-menu';

type ValidatorMenuActionItem = {
  hasPermission: boolean;
  label: string;
  modal: ValidatorsModalItem;
};

const { topUpValidator, partialWithdrawal, withdrawToStVault } =
  vaultTexts.actions.validators.table.menu;

export const useValidatorMenuActions = () => {
  const { isAdmin, isDepositor, hasWithdrawalPermission } = useShowTableMenu();

  return useMemo<ValidatorMenuActionItem[]>(
    () => [
      {
        hasPermission: isDepositor,
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
    [isAdmin, isDepositor, hasWithdrawalPermission],
  );
};
