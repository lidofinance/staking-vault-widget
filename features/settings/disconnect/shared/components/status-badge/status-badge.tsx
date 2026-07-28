import type { FC } from 'react';
import { Check, Text } from '@lidofinance/lido-ui';

import { BadgeContainer } from './styles';

type StatusBadgeProps = {
  status: 'ongoing' | 'completed';
};

export const StatusBadge: FC<StatusBadgeProps> = ({ status = 'ongoing' }) => {
  const isOngoing = status === 'ongoing';

  return (
    <BadgeContainer $status={status}>
      {isOngoing ? (
        <Text size="xs" color="warning">
          In progress
        </Text>
      ) : (
        <Text>
          <Check /> Completed
        </Text>
      )}
    </BadgeContainer>
  );
};
