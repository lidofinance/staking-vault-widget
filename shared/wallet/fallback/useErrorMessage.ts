import { useDappStatus } from 'modules/web3';
import { useConnectorInfo, interceptLedgerError } from 'reef-knot';
import { joinWithOr } from 'utils/join-with-or';
import { useConnection, useConnect } from 'wagmi';

export const useErrorMessage = (): string | undefined => {
  const { isLedger } = useConnectorInfo();
  const {
    isSupportedChain,
    isChainTypeMatched,
    isAccountActive,
    supportedChainLabels,
  } = useDappStatus();
  const { error } = useConnect();
  const { chainId } = useConnection();

  // Errors from chain state

  if (isAccountActive && !isChainTypeMatched) {
    return `Wrong network. Please switch to ${supportedChainLabels[chainId || 1]} in your wallet to wrap/unwrap.`;
  }

  if (!isSupportedChain) {
    const switchTo = joinWithOr(supportedChainLabels);

    return `Unsupported chain. Please switch to ${switchTo} in your wallet.`;
  }

  // errors from connection state

  if (!error) {
    return;
  }

  if (isLedger) {
    return interceptLedgerError(error).message;
  }

  return error?.message;
};
