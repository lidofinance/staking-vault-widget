import { useMemo } from 'react';

import { vaultTexts } from 'modules/vaults';

import type { ValidatorsModalItem } from 'features/validators/types';

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
        modal: 'topUpValidator',
      },
      {
        hasPermission: true,
        label: partialWithdrawal,
        modal: 'partialWithdrawal',
      },
      {
        hasPermission: true,
        label: withdrawToStVault,
        modal: 'fullWithdrawal',
      },
    ],
    [],
  );
};
