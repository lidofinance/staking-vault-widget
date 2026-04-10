import type { FC } from 'react';
import { Td } from '@lidofinance/lido-ui';

import { ValidatorState } from '../components';

type ValidatorPubkeyProps = {
  pubkey: string;
};

export const ValidatorPubkey: FC<ValidatorPubkeyProps> = ({ pubkey }) => {
  return (
    <Td>
      <ValidatorState type="pubkey" indexOrPubkey={pubkey} />
    </Td>
  );
};
