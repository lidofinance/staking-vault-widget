import type { FC } from 'react';

import type { ValidatorStatus } from 'modules/vaults';

import { StatusChip } from 'features/validators/shared/components';

import { TdStyled } from './styles';

type StatusCellProps = {
  status: ValidatorStatus | undefined;
};

export const StatusCell: FC<StatusCellProps> = ({ status }) => {
  return (
    <TdStyled>
      {/*{status}*/}
      {status ? <StatusChip status={status} /> : '-'}
    </TdStyled>
  );
};
