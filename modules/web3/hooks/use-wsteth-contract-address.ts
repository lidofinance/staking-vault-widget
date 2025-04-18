import { useQuery } from '@tanstack/react-query';
import { getContractAddress } from 'config';
import { useLidoSDK } from 'modules/web3';

export const useWstETHContractAddress = () => {
  const { wstETH, chainId } = useLidoSDK();

  return useQuery({
    queryKey: ['use-wsteth-contract-address', wstETH],
    enabled: !!wstETH,
    staleTime: Infinity,
    initialData: getContractAddress(chainId, 'wsteth'),
    queryFn: () => wstETH.contractAddress(),
  });
};
