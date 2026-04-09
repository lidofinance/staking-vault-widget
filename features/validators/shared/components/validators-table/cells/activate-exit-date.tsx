import type { FC } from 'react';
import { Td, Text } from '@lidofinance/lido-ui';

import { formatDate } from 'utils';

type ActivateExitDateProps = {
  activateDate: Date | undefined;
  exitDate?: Date;
};

export const ActivateExitDate: FC<ActivateExitDateProps> = ({
  activateDate,
  exitDate,
}) => {
  const isActivateDateExist = typeof activateDate === 'object';
  const isExitDateExist = typeof exitDate === 'object';

  return (
    <Td>
      <Text size="xxs">
        {isActivateDateExist ? formatDate(activateDate) : '-'}{' '}
        {isExitDateExist && '/'}
      </Text>
      {isExitDateExist && (
        <Text size="xxs" color="secondary">
          {formatDate(exitDate)}
        </Text>
      )}
    </Td>
  );
};
