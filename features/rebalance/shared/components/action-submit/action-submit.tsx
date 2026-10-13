import { PermissionedSubmitButton } from 'modules/vaults';
import { TooltipHint } from 'shared/components';

import { useActionSubmitState } from './use-action-submit-state';

import { ButtonContent } from './styles';

export const ActionSubmit = () => {
  const {
    text,
    tooltip,
    variant,
    color,
    isDisabled,
    isSubmitting,
    isForceRebalance,
  } = useActionSubmitState();

  return (
    <PermissionedSubmitButton
      dashboardRole="rebalancer"
      isPermissionless={isForceRebalance}
      variant={variant}
      color={color}
      type="submit"
      loading={isSubmitting}
      disabled={isDisabled}
      data-testid="submit"
    >
      <ButtonContent>
        {text}
        {tooltip && <TooltipHint hint={tooltip} />}
      </ButtonContent>
    </PermissionedSubmitButton>
  );
};
