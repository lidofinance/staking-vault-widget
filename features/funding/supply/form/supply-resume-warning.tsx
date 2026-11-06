import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import { WarningMessage } from 'shared/components/warning-message';

import { useSupplyForm } from './supply-form-provider';
import type { SupplyFormFieldValues } from './types';

// Resume after a confirmed fund (the mint failed): the same values send only the mint.
// Changing any value starts a new supply, and the notice disappears.
export const SupplyResumeWarning = () => {
  const { isFunded } = useSupplyForm();
  const [amount, token, mintSteth] =
    useFormContext<SupplyFormFieldValues>().watch([
      'amount',
      'token',
      'mintSteth',
    ]);

  if (!mintSteth || !isFunded) return null;

  return (
    <WarningMessage data-testid="supplyForm-alreadySupplied">
      {vaultTexts.actions.supply.alreadySupplied(token, amount)}
    </WarningMessage>
  );
};
