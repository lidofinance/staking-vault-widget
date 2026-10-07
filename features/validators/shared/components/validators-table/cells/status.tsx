import type { FC } from 'react';

import type { ValidatorsEntry } from 'modules/vaults';

import { StatusChip } from 'features/validators/shared/components';
import { getValidatorViewStatus } from 'features/validators/utils';

import { TdStyled } from './styles';

type StatusCellProps = {
  validator: Pick<ValidatorsEntry, 'status' | 'isPdg'>;
};

export const StatusCell: FC<StatusCellProps> = ({ validator }) => {
  return (
    <TdStyled data-testid="status">
      {validator.status ? (
        <StatusChip status={getValidatorViewStatus(validator)} />
      ) : (
        '-'
      )}
    </TdStyled>
  );
};
