import { ESTIMATE_ACCOUNT } from 'config/groups/web3';
import { isAddress } from 'viem';

export const fallbackedAddress = (address: string | undefined | null) =>
  address && isAddress(address) ? address : ESTIMATE_ACCOUNT;
