import invariant from 'tiny-invariant';
import type { Address } from 'viem';
import { CONTRACTS_BY_TOKENS } from '@lidofinance/lido-ethereum-sdk/common';
import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import { useQuery } from '@tanstack/react-query';

import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useDappStatus, useLidoSDK } from 'modules/web3';

const fetchTokenAddress = async (
  token: keyof typeof CONTRACTS_BY_TOKENS | undefined,
  core: LidoSDKCore,
): Promise<Address> => {
  invariant(token);
  const address = await core.getContractAddress(
    CONTRACTS_BY_TOKENS[token as keyof typeof CONTRACTS_BY_TOKENS],
  );
  invariant(address, `Do not have address for ${token} on ${core.chainId}`);
  return address;
};

export const useTokenAddress = (
  token?: keyof typeof CONTRACTS_BY_TOKENS,
): Address | undefined => {
  const { chainId } = useDappStatus();
  const { core } = useLidoSDK();

  const { data: address } = useQuery({
    queryKey: ['tokenAddress', token, core, chainId],
    enabled: !!token,
    ...STRATEGY_CONSTANT,
    queryFn: () => fetchTokenAddress(token, core),
  });

  return address;
};
