import { FC } from 'react';
import { Text, Button } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'features/overview/shared';
import { useSendReport } from './hooks';
import { VaultDisconnected } from './styles';

type DisconnectStateProps = {
  isPendingDisconnect: boolean | undefined;
  isVaultDisconnected: boolean | undefined;
};

export const DisconnectState: FC<DisconnectStateProps> = ({
  isPendingDisconnect,
  isVaultDisconnected,
}) => {
  const { applyReport } = useSendReport();

  if (isPendingDisconnect) {
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
  }

  if (isVaultDisconnected) {
    return (
      <VaultDisconnected>
        <Text size="sm" color="secondary" strong>
          stVault is disconnected from the VaultHub
        </Text>
      </VaultDisconnected>
    );
  }

  return null;
};
