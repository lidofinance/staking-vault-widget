import { useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@lidofinance/lido-ui';

import { AppPaths } from 'consts/urls';
import { parseEventLogs } from 'viem';
import { VaultFactoryAbi } from 'abi/vault-factory';
import { ModalRenderSuccessContent } from 'shared/components/transaction-modal';

export const ModalCTA: ModalRenderSuccessContent = ({ result, closeModal }) => {
  const isRouting = useRef<boolean>(false);
  const router = useRouter();
  const vaultAddress = useMemo(() => {
    const { receipts } = result;
    if (!receipts || receipts.length === 0) return null;

    const receipt = result.receipts[result.receipts.length - 1];

    const logs = parseEventLogs({
      abi: VaultFactoryAbi,
      logs: receipt.logs,
      strict: true,
      eventName: 'VaultCreated',
    });

    if (logs.length === 0) return null;

    return logs[0].args.vault;
  }, [result]);

  if (!vaultAddress) return <></>;

  const handleNavigateToVault = async () => {
    if (isRouting.current) return;

    try {
      isRouting.current = true;
      // todo fix routing
      await router.push(`/${vaultAddress}/${AppPaths.overview}`);
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
