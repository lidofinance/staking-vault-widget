import { Address } from 'viem';

export type WithdrawFormSchema = {
  amount: bigint | undefined;
  recipient: Address | undefined;
};
