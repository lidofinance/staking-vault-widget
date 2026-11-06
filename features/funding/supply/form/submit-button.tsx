import { useFormContext, useFormState } from 'react-hook-form';

import { vaultTexts, MultiplePermissionedSubmitButton } from 'modules/vaults';
import { useVerificationBannerDefender } from 'shared/components';

import { useSupplyForm } from './supply-form-provider';

import type { SupplyFormFieldValues } from './types';

const SUPPLY_ROLES = ['supplier'] as const;
const SUPPLY_MINT_ROLES = [...SUPPLY_ROLES, 'minter'] as const;

const { supplyMint, supply, supplyUnavailable, mintOnly } =
  vaultTexts.actions.supply.submit;

export const SubmitButton = () => {
  const [amount, token, mintSteth] =
    useFormContext<SupplyFormFieldValues>().watch([
      'amount',
      'token',
      'mintSteth',
    ]);

  const { isSubmitting, disabled, isValid } = useFormState();
  const { maxMintableStethQuery, isFunded, isUnwrapped } = useSupplyForm();
  const { isErrorBannerVisible, isWarningBannerVisible } =
    useVerificationBannerDefender('supply');

  const isDisabled =
    isSubmitting || disabled || (isWarningBannerVisible && !isValid);

  const variant = isErrorBannerVisible ? 'translucent' : 'filled';
  const color = isErrorBannerVisible ? 'secondary' : 'primary';

  const mintable = maxMintableStethQuery.data?.maxMintableStETH;
  // the button names what will be sent: after a confirmed fund only the mint is left,
  // after a confirmed unwrap the supply is sent in ETH
  const sentToken = isUnwrapped ? 'ETH' : token;
  const text = !mintSteth
    ? supply(sentToken, amount)
    : isFunded
      ? mintOnly(mintable)
      : supplyMint(sentToken, amount, mintable);

  const submitText = isErrorBannerVisible ? supplyUnavailable : text;

  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={mintSteth ? SUPPLY_MINT_ROLES : SUPPLY_ROLES}
      variant={variant}
      color={color}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
      data-testid="supplyForm-submitButton"
    >
      {submitText}
    </MultiplePermissionedSubmitButton>
  );
};
