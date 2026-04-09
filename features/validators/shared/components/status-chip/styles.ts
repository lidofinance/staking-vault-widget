import styled from 'styled-components';
import { Theme } from '@lidofinance/lido-ui';

import { getColorTransparency } from 'styles';
import type { ValidatorStatus } from 'modules/vaults';

const getBackgroundColor = ({
  $status,
  theme,
}: {
  $status: ValidatorStatus;
  theme: Theme;
}) => {
  const { colors } = theme;

  const statusList: Record<ValidatorStatus, string> = {
    active_ongoing: getColorTransparency(colors.success, '20%'),
    active_exiting: getColorTransparency(colors.warning, '20%'),
    active_slashed: getColorTransparency(colors.error, '20%'),
    exited_slashed: getColorTransparency(colors.error, '20%'),
    withdrawal_possible: getColorTransparency(colors.primary, '20%'),
    withdrawal_done: colors.foreground,
    pending_initialised: colors.foreground,
    pending_queued: colors.foreground,
    exited_unslashed: colors.foreground,
  };

  return statusList[$status];
};

const getTextColor = ({
  $status,
  theme,
}: {
  $status: ValidatorStatus;
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
    pending_initialised: colors.text,
    pending_queued: colors.text,
    exited_unslashed: colors.text,
  };

  return statusList[$status];
};

const getBorder = ({
  $status,
  theme,
}: {
  $status: ValidatorStatus;
  theme: Theme;
}) => {
  const statusesWithBorder = [
    'withdrawal_done',
    'pending_initialised',
    'pending_queued',
    'exited_unslashed',
  ];

  return statusesWithBorder.includes($status)
    ? `1px solid ${theme.colors.border}`
    : 'none';
};

export const StatusContainer = styled.div<{ $status: ValidatorStatus }>`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  padding: 2px 8px;
  border: ${getBorder};
  border-radius: 4px;
  background-color: ${getBackgroundColor};
`;

export const StatusText = styled.span<{ $status: ValidatorStatus }>`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: ${getTextColor};
`;
