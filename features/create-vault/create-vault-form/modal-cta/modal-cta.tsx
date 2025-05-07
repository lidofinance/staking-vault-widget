import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { Button } from '@lidofinance/lido-ui';

import { AppPaths } from 'consts/urls';
import { TransactionModalState } from 'shared/components/transaction-modal/types';
import { parseEventLogs } from 'viem';
import { VaultFactoryAbi } from 'abi/vault-factory';
import { useTransactionModal } from 'shared/components/transaction-modal';

export const ModalCTA: TransactionModalState['details']['renderSuccessContent'] =
  ({ result }) => {
    const router = useRouter();
    const { dispatchModal } = useTransactionModal();
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
      // TODO: add for responsive buttons onClick = () => Promise and handle promise there
      // TODO: fix routing
      await router.push(`/${vaultAddress}/${AppPaths.overview}`);
      dispatchModal({ type: 'close' });
    };

    return (
      <Button onClick={handleNavigateToVault} fullwidth>
        Go to vault
      </Button>
    );
  };
