import { type Address, getContract, PublicClient, WalletClient } from 'viem';

import { DelegationAbi } from 'abi/delegation';

// TODO: move to lido-sdk
export const getDelegationContract = (
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
    abi: DelegationAbi,
    client,
  });
};
