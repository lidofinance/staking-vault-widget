import type { FC } from 'react';
import { Td } from '@lidofinance/lido-ui';

import { isNumber } from 'utils';

import { ValidatorState } from '../components';

type ValidatorIndexProps = {
  index: number;
};

export const ValidatorIndex: FC<ValidatorIndexProps> = ({ index }) => {
  return (
    <Td>
      {isNumber(index) ? (
        <ValidatorState type="index" indexOrPubkey={`#${index}`} />
      ) : (
        '-'
      )}
    </Td>
  );
};
