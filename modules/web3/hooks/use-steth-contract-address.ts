import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3';

export const useStETHContractAddress = () => {
  const { stETH } = useLidoSDK();

  return useQuery({
    queryKey: ['use-steth-contract-address-field', stETH],
    enabled: !!stETH,
    staleTime: Infinity,
    queryFn: () => stETH.contractAddress(),
  });
};
