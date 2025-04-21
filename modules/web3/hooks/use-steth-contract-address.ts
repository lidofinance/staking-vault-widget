import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from 'config';
import { useLidoSDK } from 'modules/web3';

export const useStETHContractAddress = () => {
  const { stETH, chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['use-steth-contract-address', stETH],
    enabled: !!stETH,
    staleTime: Infinity,
    initialData: getContractAddress(chainId, 'lido'),
    queryFn: () => stETH.contractAddress(),
  });
};
