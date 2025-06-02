/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { useFormState, useWatch } from 'react-hook-form';

import { vaultTexts, MultiplePermissionedSubmitButton } from 'modules/vaults';

import { FundFormSchemaType } from '../types';

const FUND_ROLES = ['supplier'] as const;
const FUND_MINT_ROLES = ['supplier', 'minter'] as const;

export const SubmitButton = () => {
  const { mintSteth, token } = useWatch<FundFormSchemaType>();
  const { isSubmitting, disabled } = useFormState();

  const isDisabled = isSubmitting || disabled;

  const submitText = mintSteth
    ? vaultTexts.actions.supply.submit.supplyMint
    : vaultTexts.actions.supply.submit.supply;

  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={mintSteth ? FUND_MINT_ROLES : FUND_ROLES}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
    >
      {submitText(token!)}
    </MultiplePermissionedSubmitButton>
  );
};
