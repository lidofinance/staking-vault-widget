import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatDate } from 'utils';

import { TdStyled } from './styles';

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
    <TdStyled>
      <Text size="xxs">
        {isActivateDateExist ? formatDate(activateDate) : '-'}{' '}
        {isExitDateExist && '/'}
      </Text>
      {isExitDateExist && (
        <Text size="xxs" color="secondary">
          {formatDate(exitDate)}
        </Text>
      )}
    </TdStyled>
  );
};
