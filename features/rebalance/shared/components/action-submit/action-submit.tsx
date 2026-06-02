import { useFormContext, useFormState } from 'react-hook-form';

import { MultiplePermissionedSubmitButton, vaultTexts } from 'modules/vaults';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

const REBALANCE_ROLES = ['rebalancer'] as const;

export const ActionSubmit = () => {
  const { watch } = useFormContext<RebalanceFormFieldValues>();
  const { isSubmitting, disabled } = useFormState();
  const supplyEth = watch('supplyEth');

  const text = supplyEth
    ? `${vaultTexts.actions.rebalance.title} & Supply`
    : vaultTexts.actions.rebalance.title;

  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={REBALANCE_ROLES}
      type="submit"
      loading={isSubmitting}
      disabled={isSubmitting || disabled}
    >
      {text}
    </MultiplePermissionedSubmitButton>
  );
};
