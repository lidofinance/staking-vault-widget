import { Address } from 'viem';

export type MintFormSchema = {
  amount: bigint | undefined;
  token: string;
  recipient: Address | undefined;
};
