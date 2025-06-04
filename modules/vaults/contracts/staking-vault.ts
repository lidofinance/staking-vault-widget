import { type Address, getContract, PublicClient } from 'viem';

import { StakingVaultAbi } from 'abi/vault';
import { getEncodable } from './encodable';

// TODO: move to lido-sdk
export const getStakingVaultContract = (
  address: Address,
  publicClient: PublicClient,
) => {
  return getEncodable(
    getContract({
      address,
      abi: StakingVaultAbi,
      client: {
        public: publicClient,
      },
    }),
  );
};
