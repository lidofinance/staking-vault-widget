import { FC } from 'react';
import { formatEther } from 'viem';

import { BaseCellProps } from '../types';

export const MintCell: FC<BaseCellProps<bigint>> = ({ value }) => {
  if (value == null) {
    return null;
  }

  const minted = Number(formatEther(BigInt(value))).toFixed(5);

  return <>{minted}</>;
};
