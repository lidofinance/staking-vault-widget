import { MultiplePermissionedSubmitButton } from 'modules/vaults';
import { TooltipHint } from 'shared/components';

import { useActionSubmitState } from './use-action-submit-state';

import { ButtonContent } from './styles';

const REBALANCE_ROLES = ['rebalancer'] as const;

export const ActionSubmit = () => {
  const { text, tooltip, variant, color, isDisabled, isSubmitting } =
    useActionSubmitState();

  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={REBALANCE_ROLES}
      variant={variant}
      color={color}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
    >
      <ButtonContent>
        {text}
        {tooltip && <TooltipHint hint={tooltip} />}
      </ButtonContent>
    </MultiplePermissionedSubmitButton>
  );
};
