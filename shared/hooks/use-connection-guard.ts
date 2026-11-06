import { useCallback, useRef } from 'react';
import { useAccount } from 'wagmi';

// Captures the wallet connection when an async flow starts and tells later
// whether it is still the same, so results of account A aren't applied for account B
export const useConnectionGuard = () => {
  const { address, chainId } = useAccount();
  const currentRef = useRef({ address, chainId });
  currentRef.current = { address, chainId };

  return useCallback(() => {
    const started = currentRef.current;
    return () =>
      currentRef.current.address === started.address &&
      currentRef.current.chainId === started.chainId;
  }, []);
};
