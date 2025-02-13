import { BaseCellProps } from './types';
import { VaultInfo } from 'types';
import { formatEther } from 'viem';

export const MintCell = ({ value }: BaseCellProps) => {
  if (typeof value !== 'object') {
    return null;
  }

  const minted = Number(
    formatEther(BigInt((value as VaultInfo)?.minted)),
  ).toFixed(5);
  const mintable = Number(
    formatEther(BigInt((value as VaultInfo)?.mintable)),
  ).toFixed(5);

  return (
    <>
      {minted} / {mintable}
    </>
  );
};
