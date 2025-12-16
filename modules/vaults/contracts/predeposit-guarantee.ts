import { getContract } from 'viem';
import invariant from 'tiny-invariant';

import { getContractAddress } from 'config';
import { PredepositGuaranteeAbi } from 'abi/predeposit-guarantee';
import { getEncodable } from 'modules/vaults/utils/encodable';
import type { RegisteredPublicClient } from 'modules/web3';

export const getPredepositGuaranteeContract = (
  publicClient: RegisteredPublicClient,
) => {
  const address = getContractAddress(
    publicClient.chain.id,
    'predepositGuarantee',
  );

  invariant(
    address,
    '[getPredepositGuaranteeContract] predepositGuarantee address is not defined',
  );
  return getEncodable(
    getContract({
      address,
      abi: PredepositGuaranteeAbi,
      client: {
        public: publicClient,
      },
    }),
  );
};
