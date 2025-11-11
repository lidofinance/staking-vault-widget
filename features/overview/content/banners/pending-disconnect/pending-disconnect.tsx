import { FC } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'features/overview/shared';
import { useSendReport } from './hooks';

type DisconnectStateProps = {
  isPendingDisconnect: boolean | undefined;
};

export const PendingDisconnect: FC<DisconnectStateProps> = ({
  isPendingDisconnect,
}) => {
  const { applyReport } = useSendReport();

  if (!isPendingDisconnect) {
    return null;
  }

  return (
    <NoticeContainer
      title="Pending disconnect from Lido Core"
      type="info"
      description={
        'Lido Core disconnection has been initiated. To complete the process, apply the latest Oracle report. Once applied, the connection deposit will be unlocked and can be withdrawn from the stVault balance.'
      }
    >
      <Button
        size="sm"
        variant="outlined"
        color="secondary"
        onClick={() => applyReport()}
      >
        Apply the latest Oracle report
      </Button>
    </NoticeContainer>
  );
};
