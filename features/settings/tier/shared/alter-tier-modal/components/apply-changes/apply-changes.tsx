import { type FC, useCallback } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useSyncTier } from '../../hooks';

type ApplyChangesProps = {
  closeModal: () => void;
};

export const ApplyChanges: FC<ApplyChangesProps> = ({ closeModal }) => {
  const { syncTier } = useSyncTier();
  const onClick = useCallback(async () => {
    await syncTier();
    closeModal();
  }, [syncTier, closeModal]);

  return (
    <Button size="sm" onClick={onClick}>
      Apply changes
    </Button>
  );
};
