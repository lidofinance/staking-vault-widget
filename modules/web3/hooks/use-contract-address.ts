import type { Address } from 'viem';
import { useQuery } from '@tanstack/react-query';
import type { LIDO_CONTRACT_NAMES } from '@lidofinance/lido-ethereum-sdk/common';

import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from 'modules/web3';

export const useContractAddress = (contractName: LIDO_CONTRACT_NAMES) => {
  const { core } = useLidoSDK();

  return useQuery<Address | null>({
    queryKey: ['use-contract-address', core.chainId, contractName],
    enabled: !!core && !!core.chainId,
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      return core.getContractAddress(contractName as LIDO_CONTRACT_NAMES);
    },
  });
};
