import { type Address, createPublicClient, getContract, http } from 'viem';
import { holesky } from 'viem/chains';

import { StakingVaultAbi } from 'abi/vault';

// TODO: move to lido-sdk
export const getStakingVaultContract = (address: Address) => {
  return getContract({
    address,
    abi: StakingVaultAbi,
    client: {
      public: createPublicClient({
        chain: holesky,
        transport: http('https://1rpc.io/holesky'),
      }),
    },
  });
};
