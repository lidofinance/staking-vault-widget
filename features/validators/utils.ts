import type { Theme } from '@lidofinance/lido-ui';
import type { ValidatorStatus } from 'modules/vaults';

export const getValidatorStatusTextColor = ({
  $status,
  theme,
}: {
  $status: ValidatorStatus | undefined;
  theme: Theme;
}) => {
  const { colors } = theme;

  const statusList: Record<ValidatorStatus, string> = {
    active_ongoing: colors.success,
    active_exiting: colors.warning,
    active_slashed: colors.error,
    exited_slashed: colors.error,
    withdrawal_possible: colors.primary,
    withdrawal_done: colors.textSecondary,
    pending_initialised: colors.textSecondary,
    pending_queued: colors.textSecondary,
    exited_unslashed: colors.textSecondary,
  };

  return $status ? statusList[$status] : colors.text;
};
