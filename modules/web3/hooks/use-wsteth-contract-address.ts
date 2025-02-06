import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3';

export const useWstETHContractAddress = () => {
  const { wstETH } = useLidoSDK();

  return useQuery({
    queryKey: ['use-wsteth-contract-address', wstETH],
    enabled: !!wstETH,
    staleTime: Infinity,
    queryFn: () => wstETH.contractAddress(),
  });
};
