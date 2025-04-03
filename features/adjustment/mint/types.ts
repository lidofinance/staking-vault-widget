import { Address } from 'viem';

export type MintFormSchema = {
  amount: number | undefined;
  token: string;
  recipient: Address | undefined;
};
