import type { Theme } from '@lidofinance/lido-ui';
import type { ValidatorStatus } from 'modules/vaults';
import { BEACONCHA_LINK_BY_NETWORK } from './const';

type BeaconchaChainId = keyof typeof BEACONCHA_LINK_BY_NETWORK;

export const getBeaconchaBaseUrlByChainId = (
  chainId: number | undefined,
): string => {
  if (!chainId || !(chainId in BEACONCHA_LINK_BY_NETWORK)) {
    return '#';
  }

  return BEACONCHA_LINK_BY_NETWORK[chainId as BeaconchaChainId];
};

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
    pending_initialized: colors.textSecondary,
    pending_queued: colors.textSecondary,
    exited_unslashed: colors.textSecondary,
    in_queue: colors.textSecondary,
  };

  return $status ? statusList[$status] : colors.text;
};
