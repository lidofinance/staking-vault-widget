import { useMemo } from 'react';

import { vaultTexts } from 'modules/vaults';

import type { ValidatorsModalItem } from 'features/validators/types';
import { VALIDATOR_MODALS } from 'features/validators/const';

type ValidatorMenuActionItem = {
  hasPermission: boolean;
  label: string;
  modal: ValidatorsModalItem;
};

const { topUpValidator, partialWithdrawal, withdrawToStVault } =
  vaultTexts.actions.validators.table.menu;

export const useValidatorMenuActions = () => {
  return useMemo<ValidatorMenuActionItem[]>(
    () => [
      {
        hasPermission: true,
        label: topUpValidator,
        modal: VALIDATOR_MODALS.topUpValidator,
      },
      {
        hasPermission: true,
        label: partialWithdrawal,
        modal: VALIDATOR_MODALS.partialWithdrawal,
      },
      {
        hasPermission: true,
        label: withdrawToStVault,
        modal: VALIDATOR_MODALS.fullWithdrawal,
      },
    ],
    [],
  );
};
