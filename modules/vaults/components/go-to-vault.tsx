import { useRef } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@lidofinance/lido-ui';
import { AppPaths } from 'consts/urls';

import { ModalRenderSuccessContent } from 'shared/components/transaction-modal';

import { useVaultInfo } from '../vault-context';

export const GoToVault: ModalRenderSuccessContent = ({ closeModal }) => {
  const isRoutingRef = useRef<boolean>(false);
  const router = useRouter();
  const { vaultAddress } = useVaultInfo();

  const handleNavigateToVault = async () => {
    if (isRoutingRef.current || !vaultAddress) return;
    try {
      isRoutingRef.current = true;
      // todo fix routing
      await router.push(`/${vaultAddress}/${AppPaths.overview}`);
      closeModal();
    } finally {
      isRoutingRef.current = false;
    }
  };

  return (
    <Button onClick={handleNavigateToVault} fullwidth>
      Go to vault
    </Button>
  );
};
