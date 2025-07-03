import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, MultiplePermissionedSubmitButton } from 'modules/vaults';

import { useFundForm } from './fund-form-provider';

import type { FundFormFieldValues } from './types';

const FUND_ROLES = ['supplier'] as const;
const FUND_MINT_ROLES = ['supplier', 'minter'] as const;

export const SubmitButton = () => {
  const [amount, token, mintSteth] =
    useFormContext<FundFormFieldValues>().watch([
      'amount',
      'token',
      'mintSteth',
    ]);

  const { isSubmitting, disabled } = useFormState();
  const { maxMintableStethQuery } = useFundForm();

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
      dashboardRoles={mintSteth ? FUND_MINT_ROLES : FUND_ROLES}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
    >
      {submitText}
    </MultiplePermissionedSubmitButton>
  );
};
