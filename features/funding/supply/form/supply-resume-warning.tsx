import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';
import { WarningMessage } from 'shared/components/warning-message';

import { useSupplyForm } from './supply-form-provider';
import type { SupplyFormFieldValues } from './types';

// Resume after a confirmed step: after a fund (the mint failed) only the mint is sent,
// after an unwrap (the fund failed) the fund from the unwrapped ETH and the mint.
// Changing any value starts a new supply, and the notice disappears.
export const SupplyResumeWarning = () => {
  const { isFunded, isUnwrapped } = useSupplyForm();
  const [amount, token, mintSteth] =
    useFormContext<SupplyFormFieldValues>().watch([
      'amount',
      'token',
      'mintSteth',
    ]);

  if (isUnwrapped) {
    return (
      <WarningMessage data-testid="supplyForm-alreadyUnwrapped">
        {vaultTexts.actions.supply.alreadyUnwrapped(amount, mintSteth)}
      </WarningMessage>
    );
  }

  if (!mintSteth || !isFunded) return null;

  return (
    <WarningMessage data-testid="supplyForm-alreadySupplied">
      {vaultTexts.actions.supply.alreadySupplied(token, amount)}
    </WarningMessage>
  );
};
