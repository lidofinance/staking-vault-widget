import { type FC, useCallback } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { useSyncTier } from '../../hooks';

type ApplyChangesProps = {
  closeModal: () => void;
};

export const ApplyChanges: FC<ApplyChangesProps> = ({ closeModal }) => {
  const { syncTier } = useSyncTier();
  const { refetch } = useVault();

  const onClick = useCallback(async () => {
    closeModal();
    await syncTier();
    await refetch();
  }, [syncTier, refetch, closeModal]);

  return (
    <Button
      size="sm"
      onClick={onClick}
      data-testid="syncTier-modal-applyChangesButton"
    >
      Apply changes
    </Button>
  );
};
