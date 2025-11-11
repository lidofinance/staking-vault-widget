import { FC } from 'react';

import { useVault, vaultTexts } from 'modules/vaults';

import { NoticeContainer } from 'features/overview/shared';
import { useSendReport } from './hooks';
import { ApplyButton } from './styles';

type DisconnectStateProps = {
  isPendingDisconnect: boolean | undefined;
};

const texts = vaultTexts.metrics.pendingDisconnect;

export const PendingDisconnect: FC<DisconnectStateProps> = ({
  isPendingDisconnect,
}) => {
  const { applyReport } = useSendReport();
  const { activeVault } = useVault();
  const isReportAvailable = activeVault?.isReportAvailable;
  const description = isReportAvailable
    ? texts.description.reportIsAvailable
    : texts.description.reportIsNotAvailable;

  if (!isPendingDisconnect) {
    return null;
  }

  return (
    <NoticeContainer title={texts.title} type="info" description={description}>
      {isReportAvailable && (
        <ApplyButton
          size="xs"
          variant="outlined"
          color="secondary"
          onClick={() => applyReport()}
        >
          Apply the latest Oracle report
        </ApplyButton>
      )}
    </NoticeContainer>
  );
};
