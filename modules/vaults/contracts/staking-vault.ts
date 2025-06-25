import { type Address, getContract } from 'viem';

import { StakingVaultAbi } from 'abi/vault';
import { RegisteredPublicClient } from 'modules/web3';

// TODO: move to lido-sdk
export const getStakingVaultContract = (
  address: Address,
  publicClient: RegisteredPublicClient,
) => {
  return getContract({
    address,
    abi: StakingVaultAbi,
    client: {
      public: publicClient,
    },
  });
};
