import { useEffect, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';
import { checkTermsAccepted } from 'reef-knot/core-react';

// reef-knot auto connect runs eager connect and a 100ms delay before reconnect,
// so status stays 'disconnected' for a while; give up waiting after this
const RESTORE_TIMEOUT_MS = 1000;

// true while it's unknown whether a remembered wallet is going to reconnect:
// before mount (no storage on SSR) and until reef-knot starts the reconnect
export const useWalletRestoring = () => {
  const { storage } = useConfig();
  const { status } = useAccount();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    if (!isRestoring) return;

    let isCancelled = false;
    const settle = () => {
      if (!isCancelled) setIsRestoring(false);
    };

    if (status !== 'disconnected') {
      settle();
      return;
    }

    const timer = setTimeout(settle, RESTORE_TIMEOUT_MS);
    void (async () => {
      const hasRememberedWallet =
        checkTermsAccepted() && !!(await storage?.getItem('recentConnectorId'));
      if (!hasRememberedWallet) settle();
    })();

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [isRestoring, status, storage]);

  return isRestoring;
};
