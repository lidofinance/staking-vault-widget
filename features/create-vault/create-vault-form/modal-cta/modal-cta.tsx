import { useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@lidofinance/lido-ui';

import { ModalRenderSuccessContent } from 'shared/components/transaction-modal';
import { appPaths } from 'consts/routing';
import { parseVaultTx } from '../utils';

export const ModalCTA: ModalRenderSuccessContent = ({ result, closeModal }) => {
  const isRouting = useRef<boolean>(false);
  const router = useRouter();
  const { vaultAddress } = useMemo(() => {
    return parseVaultTx(result);
  }, [result]);

  if (!vaultAddress) return <></>;

  const handleNavigateToVault = async () => {
    if (isRouting.current) return;

    try {
      isRouting.current = true;
      await router.push(appPaths.vaults.vault(vaultAddress).overview);
      closeModal();
    } finally {
      isRouting.current = false;
    }
  };

  return (
    <Button onClick={handleNavigateToVault} fullwidth>
      Go to vault
    </Button>
  );
};
