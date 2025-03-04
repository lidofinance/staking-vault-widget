import { type Address, createPublicClient, getContract, http } from 'viem';
import { holesky } from 'viem/chains';

import { DelegationAbi } from 'abi/delegation';

// TODO: move to lido-sdk
export const getDelegationContract = (address: Address) => {
  return getContract({
    address,
    abi: DelegationAbi,
    client: {
      public: createPublicClient({
        chain: holesky,
        transport: http('https://1rpc.io/holesky'),
      }),
    },
  });
};
