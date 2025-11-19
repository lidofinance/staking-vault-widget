import { getContract } from 'viem';
import { PredepositGuaranteeAbi } from 'abi/predeposit-guarantee';

import invariant from 'tiny-invariant';
import { getContractAddress } from 'config';
import { RegisteredPublicClient } from 'modules/web3';
import { getEncodable } from '../utils/encodable';

// TODO: move to lido-sdk
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
