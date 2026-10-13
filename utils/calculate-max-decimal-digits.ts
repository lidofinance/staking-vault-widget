import { ONE_ETHER } from 'consts/tx';

export const calculateMaxDecimalDigits = (amount = 0n, base = 1000n) => {
  return amount / ONE_ETHER > base ? 1 : 4;
};
