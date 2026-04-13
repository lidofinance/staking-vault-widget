import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import type { ValidatorStatus } from 'modules/vaults';

import { StatusContainer, StatusText } from './styles';

type StatusChipProps = {
  status: ValidatorStatus;
  value?: number;
};

export const StatusChip: FC<StatusChipProps> = ({ value, status }) => {
  return (
    <StatusContainer $status={status}>
      {typeof value === 'number' && (
        <Text size="xxs" as="span">
          {value}
        </Text>
      )}
      <StatusText $status={status}>{status}</StatusText>
    </StatusContainer>
  );
};
