import { type Address, getContract, PublicClient } from 'viem';

import { StakingVaultAbi } from 'abi/vault';

// TODO: move to lido-sdk
export const getStakingVaultContract = (
  address: Address,
  publicClient: PublicClient,
) => {
  return getContract({
    address,
    abi: StakingVaultAbi,
    client: {
      public: publicClient,
    },
  });
};
