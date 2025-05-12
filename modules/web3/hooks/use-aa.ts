import { useCapabilities } from 'wagmi';
import { useDappStatus } from './use-dapp-status';

export const useAA = () => {
  const { chainId, isAccountActive } = useDappStatus();
  const capabilitiesQuery = useCapabilities({
    query: {
      enabled: isAccountActive,
    },
  });

  // merge capabilities per https://eips.ethereum.org/EIPS/eip-5792
  const capabilities = capabilitiesQuery.data
    ? {
        ...(capabilitiesQuery.data[0] ?? {}),
        ...(capabilitiesQuery.data[chainId] ?? {}),
      }
    : undefined;

  // per EIP-5792 ANY successful call to getCapabilities is a sign of EIP support
  const isAA = capabilitiesQuery.isFetched && !!capabilitiesQuery.data;

  const isAtomicBatchSupported = !!capabilities?.atomicBatch?.supported;
  const areAuxiliaryFundsSupported = !!capabilities?.auxiliaryFunds?.supported;

  return {
    ...capabilitiesQuery,
    isAA,
    capabilities,
    isAtomicBatchSupported,
    areAuxiliaryFundsSupported,
  };
};
