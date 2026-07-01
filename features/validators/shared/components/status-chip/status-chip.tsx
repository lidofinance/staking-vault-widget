import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import type { ValidatorStatus } from 'modules/vaults';
import { isNumber } from 'utils';

import { StatusContainer, StatusText } from './styles';

type StatusChipProps = {
  status: ValidatorStatus;
  value?: number;
  'data-testid'?: string;
};

export const StatusChip: FC<StatusChipProps> = ({
  value,
  status,
  'data-testid': dataTestId,
}) => {
  return (
    <StatusContainer $status={status} data-testid={dataTestId}>
      {isNumber(value) && (
        <Text size="xxs" as="span">
          {value}
        </Text>
      )}
      <StatusText $status={status}>{status}</StatusText>
    </StatusContainer>
  );
};
