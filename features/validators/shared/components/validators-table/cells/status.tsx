import type { FC } from 'react';
import { Td } from '@lidofinance/lido-ui';

import type { ValidatorStatus } from 'modules/vaults';

import { StatusChip } from 'features/validators/shared/components';

type StatusCellProps = {
  status: ValidatorStatus | undefined;
};

export const StatusCell: FC<StatusCellProps> = ({ status }) => {
  return (
    <Td>
      {/*{status}*/}
      {status ? <StatusChip status={status} /> : '-'}
    </Td>
  );
};
