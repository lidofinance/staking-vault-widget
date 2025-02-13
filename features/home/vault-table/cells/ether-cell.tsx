import { formatEther } from 'viem';
import { BaseCellProps } from './types';

export const EtherCell = ({ value }: BaseCellProps) => {
  if (typeof value !== 'bigint') {
    return null;
  }

  return <>{Number(formatEther(BigInt(value))).toFixed(5)}</>;
};
