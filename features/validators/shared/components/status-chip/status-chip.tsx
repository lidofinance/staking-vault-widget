import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { isNumber } from 'utils';

import type { ValidatorViewStatus } from 'features/validators/const';
import { getTextForStatus } from 'features/validators/utils';

import { StatusContainer, StatusText } from './styles';

type StatusChipProps = {
  status: ValidatorViewStatus;
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
      <StatusText $status={status}>{getTextForStatus(status)}</StatusText>
    </StatusContainer>
  );
};
