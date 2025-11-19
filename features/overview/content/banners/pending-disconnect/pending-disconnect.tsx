import { useVault, vaultTexts } from 'modules/vaults';

import { NoticeContainer } from 'features/overview/shared';
import { useSendReport } from './hooks';
import { ApplyButton } from './styles';

const texts = vaultTexts.metrics.pendingDisconnect;

export const PendingDisconnect = () => {
  const { applyReport } = useSendReport();
  const { activeVault } = useVault();
  const isReportAvailable = activeVault?.isReportAvailable;
  const description = isReportAvailable
    ? texts.description.reportIsAvailable
    : texts.description.reportIsNotAvailable;

  if (!activeVault?.isPendingDisconnect || !!activeVault?.isVaultDisconnected) {
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
