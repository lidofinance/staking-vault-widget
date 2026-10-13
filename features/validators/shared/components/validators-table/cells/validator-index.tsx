import type { FC } from 'react';

import { isNumber } from 'utils';

import { ValidatorState } from '../components';

import { TdStyled } from './styles';

type ValidatorIndexProps = {
  index: number | null;
};

export const ValidatorIndex: FC<ValidatorIndexProps> = ({ index }) => {
  return (
    <TdStyled data-testid="index">
      {isNumber(index) ? (
        <ValidatorState type="index" indexOrPubkey={`${index}`} />
      ) : (
        '-'
      )}
    </TdStyled>
  );
};
