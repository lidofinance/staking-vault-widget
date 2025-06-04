import { type Address, getContract, PublicClient, WalletClient } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { getEncodable } from './encodable';

// TODO: move to lido-sdk
export const getDashboardContract = (
  address: Address,
  publicClient: PublicClient,
  walletClient?: WalletClient,
) => {
  const client: { public: PublicClient; wallet?: WalletClient } = {
    public: publicClient,
  };

  if (walletClient) {
    client.wallet = walletClient;
  }

  return getEncodable(
    getContract({
      address,
      abi: dashboardAbi,
      client,
    }),
  );
};
