import type { FC } from 'react';
import { Check, Text } from '@lidofinance/lido-ui';

import { BadgeContainer, CompleteWrapper } from './styles';

type StatusBadgeProps = {
  status: 'ongoing' | 'completed';
  size?: 'small' | 'medium' | 'large';
};

export const StatusBadge: FC<StatusBadgeProps> = ({
  status = 'ongoing',
  size = 'medium',
}) => {
  const isOngoing = status === 'ongoing';

  return (
    <BadgeContainer $status={status} $size={size}>
      {isOngoing ? (
        <Text size="xs" color="warning" strong>
          In progress
        </Text>
      ) : (
        <CompleteWrapper>
          <Check />
          <Text size="xs" strong>
            Completed
          </Text>
        </CompleteWrapper>
      )}
    </BadgeContainer>
  );
};
