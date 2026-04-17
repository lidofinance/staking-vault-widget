import type { FC } from 'react';

import { ValidatorState } from '../components';

import { TdStyled } from './styles';

type ValidatorPubkeyProps = {
  pubkey: string;
};

export const ValidatorPubkey: FC<ValidatorPubkeyProps> = ({ pubkey }) => {
  return (
    <TdStyled>
      <ValidatorState type="pubkey" indexOrPubkey={pubkey} />
    </TdStyled>
  );
};
