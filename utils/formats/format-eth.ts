import { parseEther } from 'viem';

import { formatBalance } from './format-balance';

const eth = parseEther('1');
const K = 1_000n;
const M = 1_000_000n;

export const formatBigEthAmount = (
  amount: bigint,
  symbol?: 'ETH' | 'stETH',
): string => {
  const amountInEth = amount / eth;

  if (amountInEth >= M) {
    return `${amountInEth / M}M ${symbol ?? ''}`.trim();
  }

  if (amountInEth >= K) {
    return `${amountInEth / K}K ${symbol ?? ''}`.trim();
  }

  return formatBalance(amount, { maxDecimalDigits: 2 }).trimmed;
};

export const isOverKiloEth = (amount: bigint) => {
  return amount / eth >= K;
};
