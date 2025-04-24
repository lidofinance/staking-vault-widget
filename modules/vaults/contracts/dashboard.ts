import { type Address, getContract, PublicClient, WalletClient } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';

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

  return getContract({
    address,
    abi: dashboardAbi,
    client,
  });
};
