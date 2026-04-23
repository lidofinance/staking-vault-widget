import type { FC } from 'react';

import { isNumber } from 'utils';

import { ValidatorState } from '../components';

import { TdStyled } from './styles';

type ValidatorIndexProps = {
  index: number;
};

export const ValidatorIndex: FC<ValidatorIndexProps> = ({ index }) => {
  return (
    <TdStyled>
      {isNumber(index) ? (
        <ValidatorState type="index" indexOrPubkey={`${index}`} />
      ) : (
        '-'
      )}
    </TdStyled>
  );
};
