import { Address } from 'viem';

export type WithdrawFormSchema = {
  amount: number | undefined;
  recipient: Address | undefined;
  token: string;
};
