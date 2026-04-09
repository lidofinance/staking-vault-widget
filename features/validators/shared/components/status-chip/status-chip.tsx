import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import type { ValidatorStatus } from 'modules/vaults';

import { StatusContainer, StatusText } from './styles';

type StatusChipProps = {
  status: ValidatorStatus;
  volume?: number;
};

export const StatusChip: FC<StatusChipProps> = ({ volume, status }) => {
  return (
    <StatusContainer $status={status}>
      {typeof volume === 'number' && (
        <Text size="xxs" as="span">
          {volume}
        </Text>
      )}
      <StatusText $status={status}>{status}</StatusText>
    </StatusContainer>
  );
};
