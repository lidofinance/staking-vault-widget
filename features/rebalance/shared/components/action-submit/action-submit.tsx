import { PermissionedSubmitButton } from 'modules/vaults';
import { TooltipHint } from 'shared/components';

import { useActionSubmitState } from './use-action-submit-state';

import { ButtonContent } from './styles';

export const ActionSubmit = () => {
  const { text, tooltip, variant, color, isDisabled, isSubmitting } =
    useActionSubmitState();

  return (
    <PermissionedSubmitButton
      dashboardRole="rebalancer"
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
    </PermissionedSubmitButton>
  );
};
