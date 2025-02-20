import { FC } from 'react';
import { formatEther } from 'viem';

import { BaseCellProps } from '../types';

export const EtherCell: FC<BaseCellProps<bigint>> = ({ value }) => {
  return <>{Number(formatEther(BigInt(value))).toFixed(5)}</>;
};
