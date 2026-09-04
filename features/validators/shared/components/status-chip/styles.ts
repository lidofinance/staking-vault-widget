import styled from 'styled-components';
import { Theme } from '@lidofinance/lido-ui';

import { getColorTransparency } from 'styles';

import type { ValidatorViewStatus } from 'features/validators/const';
import { getValidatorStatusTextColor } from 'features/validators/utils';

const getBackgroundColor = ({
  $status,
  theme,
}: {
  $status: ValidatorViewStatus;
  theme: Theme;
}) => {
  const { colors } = theme;

  const statusList: Record<ValidatorViewStatus, string> = {
    active_ongoing: getColorTransparency(colors.success, '20%'),
    active_exiting: getColorTransparency(colors.warning, '20%'),
    active_slashed: getColorTransparency(colors.error, '20%'),
    exited_slashed: getColorTransparency(colors.error, '20%'),
    withdrawal_possible: getColorTransparency(colors.primary, '20%'),
    withdrawal_done: colors.foreground,
    pending_initialized: colors.backgroundSecondary,
    pending_queued: colors.backgroundSecondary,
    exited_unslashed: colors.backgroundSecondary,
    in_queue: colors.background,
    deposited: colors.background,
    pre_deposited: colors.background,
  };

  return statusList[$status];
};

const getBorder = ({
  $status,
  theme,
}: {
  $status: ValidatorViewStatus;
  theme: Theme;
}) => {
  const statusesWithBorder = ['withdrawal_done'];

  return statusesWithBorder.includes($status)
    ? `1px solid ${theme.colors.border}`
    : 'none';
};

export const StatusContainer = styled.div<{ $status: ValidatorViewStatus }>`
  display: flex;
  align-items: center;
  width: fit-content;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  padding: 2px 8px;
  border: ${getBorder};
  border-radius: 4px;
  background-color: ${getBackgroundColor};
`;

export const StatusText = styled.span<{ $status: ValidatorViewStatus }>`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  font-weight: normal;
  color: ${getValidatorStatusTextColor};
`;
