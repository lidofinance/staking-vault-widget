import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, MultiplePermissionedSubmitButton } from 'modules/vaults';

import { useSupplyForm } from './supply-form-provider';

import type { SupplyFormFieldValues } from './types';

const SUPPLY_ROLES = ['supplier'] as const;
const SUPPLY_MINT_ROLES = [...SUPPLY_ROLES, 'minter'] as const;

export const SubmitButton = () => {
  const [amount, token, mintSteth] =
    useFormContext<SupplyFormFieldValues>().watch([
      'amount',
      'token',
      'mintSteth',
    ]);

  const { isSubmitting, disabled } = useFormState();
  const { maxMintableStethQuery } = useSupplyForm();

  const isDisabled = isSubmitting || disabled;

  const submitText = mintSteth
    ? vaultTexts.actions.supply.submit.supplyMint(
        token,
        amount,
        maxMintableStethQuery.data?.maxMintableStETH,
      )
    : vaultTexts.actions.supply.submit.supply(token, amount);

  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={mintSteth ? SUPPLY_MINT_ROLES : SUPPLY_ROLES}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
    >
      {submitText}
    </MultiplePermissionedSubmitButton>
  );
};
