import { formatBalance } from './format-balance';

export const toEthValue = (value: bigint | undefined) =>
  typeof value === 'bigint' ? `${formatBalance(value).trimmed} ETH` : '';
export const toStethValue = (value: bigint | undefined, withSymbol = true) =>
  typeof value === 'bigint'
    ? `${formatBalance(value).trimmed}${withSymbol ? ' stETH' : ''}`
    : '';
