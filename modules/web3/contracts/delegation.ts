import { type Address, getContract, PublicClient } from 'viem';

import { DelegationAbi } from 'abi/delegation';

// TODO: move to lido-sdk
export const getDelegationContract = (
  address: Address,
  publicClient: PublicClient,
) => {
  return getContract({
    address,
    abi: DelegationAbi,
    client: {
      public: publicClient,
    },
  });
};
