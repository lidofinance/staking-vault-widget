import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, MultiplePermissionedSubmitButton } from 'modules/vaults';
import { useAntiScamBannerState } from 'shared/components';

import { useSupplyForm } from './supply-form-provider';

import type { SupplyFormFieldValues } from './types';

const SUPPLY_ROLES = ['supplier'] as const;
const SUPPLY_MINT_ROLES = [...SUPPLY_ROLES, 'minter'] as const;

const { supplyMint, supply, supplyUnavailable } =
  vaultTexts.actions.supply.submit;

export const SubmitButton = () => {
  const [amount, token, mintSteth] =
    useFormContext<SupplyFormFieldValues>().watch([
      'amount',
      'token',
      'mintSteth',
    ]);

  const { isSubmitting, disabled, isValid } = useFormState();
  const { maxMintableStethQuery } = useSupplyForm();
  const { isErrorBannerVisible, isWarningBannerVisible } =
    useAntiScamBannerState('supply');

  const isDisabled =
    isSubmitting || disabled || (isWarningBannerVisible && !isValid);

  const variant = isErrorBannerVisible ? 'translucent' : 'filled';
  const color = isErrorBannerVisible ? 'secondary' : 'primary';

  const text = mintSteth
    ? supplyMint(token, amount, maxMintableStethQuery.data?.maxMintableStETH)
    : supply(token, amount);

  const submitText = isErrorBannerVisible ? supplyUnavailable : text;

  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={mintSteth ? SUPPLY_MINT_ROLES : SUPPLY_ROLES}
      variant={variant}
      color={color}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
    >
      {submitText}
    </MultiplePermissionedSubmitButton>
  );
};
