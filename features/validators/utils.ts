import type { Theme } from '@lidofinance/lido-ui';

import type { ValidatorsEntry } from 'modules/vaults';

import {
  BEACONCHA_LINK_BY_NETWORK,
  VALIDATORS_VIEW_STATUSES,
  type ValidatorViewStatus,
} from './const';

type BeaconchaChainId = keyof typeof BEACONCHA_LINK_BY_NETWORK;

export const getBeaconchaBaseUrlByChainId = (
  chainId: number | undefined,
): string => {
  if (!chainId || !(chainId in BEACONCHA_LINK_BY_NETWORK)) {
    return '#';
  }

  return BEACONCHA_LINK_BY_NETWORK[chainId as BeaconchaChainId];
};

// `in_queue` means the deposit is still in the beacon chain queue and the
// validator does not exist on the consensus layer yet. It covers both the 1 ETH
// PDG pre-deposit and an off-book deposit, so `isPdg` is what splits them apart.
export const getValidatorViewStatus = ({
  status,
  isPdg,
}: Pick<ValidatorsEntry, 'status' | 'isPdg'>): ValidatorViewStatus =>
  status === 'in_queue' ? (isPdg ? 'pre_deposited' : 'deposited') : status;

export const getValidatorStatusTextColor = ({
  $status,
  theme,
}: {
  $status: ValidatorViewStatus | undefined;
  theme: Theme;
}) => {
  const { colors } = theme;

  const statusList: Record<ValidatorViewStatus, string> = {
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
    deposited: colors.textSecondary,
    pre_deposited: colors.textSecondary,
  };

  return $status ? statusList[$status] : colors.text;
};

export const getTextForStatus = (status: ValidatorViewStatus) =>
  VALIDATORS_VIEW_STATUSES[status];
