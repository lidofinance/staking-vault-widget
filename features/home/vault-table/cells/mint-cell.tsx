import { FC } from 'react';
import { formatEther } from 'viem';

import { Mintable } from './styles';

import { BaseCellProps } from '../types';
import { VaultInfo } from 'types';

export const MintCell: FC<BaseCellProps<VaultInfo>> = ({ value }) => {
  if (typeof value !== 'object') {
    return null;
  }

  const minted = Number(formatEther(BigInt(value?.minted))).toFixed(5);
  const mintable = Number(formatEther(BigInt(value?.mintable))).toFixed(5);

  return (
    <>
      {minted} <Mintable>/ {mintable}</Mintable>
    </>
  );
};
