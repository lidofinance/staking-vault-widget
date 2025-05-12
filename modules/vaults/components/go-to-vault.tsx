import { useRef } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@lidofinance/lido-ui';

import { ModalRenderSuccessContent } from 'shared/components/transaction-modal';

import { useVaultInfo } from '../vault-context';
import { appPaths } from 'consts/routing';

export const GoToVault: ModalRenderSuccessContent = ({ closeModal }) => {
  const isRoutingRef = useRef<boolean>(false);
  const router = useRouter();
  const { vaultAddress } = useVaultInfo();

  const handleNavigateToVault = async () => {
    if (isRoutingRef.current || !vaultAddress) return;
    try {
      isRoutingRef.current = true;

      await router.push(appPaths.vaults.vault(vaultAddress).overview);
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
