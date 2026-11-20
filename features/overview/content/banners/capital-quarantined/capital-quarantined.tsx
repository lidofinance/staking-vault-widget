import { useVault } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { NoticeContainer } from 'shared/components';

import { useVaultOverview } from 'features/overview/vault-overview';
import { ApplyButton } from '../styles';
import { QuarantineDescription } from './quarantine-description';
import {
  useApplyQuarantineReport,
  useOnchainQuarantine,
  useReportFrameDuration,
} from './hooks';
import { getQuarantineBannerState } from './utils';

export const CapitalQuarantined = () => {
  const { activeVault } = useVault();
  const { isDappActive } = useDappStatus();
  const { values } = useVaultOverview();
  const { data: onchain, isLoading: isOnchainLoading } = useOnchainQuarantine();
  const { data: frameDuration, isLoading: isFrameDurationLoading } =
    useReportFrameDuration();
  const { applyReport, mutation } = useApplyQuarantineReport();

  if (!activeVault || isOnchainLoading || isFrameDurationLoading) {
    return null;
  }

  const state = getQuarantineBannerState({
    isReportFresh: activeVault.isReportFresh,
    isReportAvailable: activeVault.isReportAvailable,
    hubReportTimestamp: activeVault.hubReport.timestamp,
    onchain,
    simulated: values?.vaultQuarantineState,
    simulatedTotalValue: values?.totalValueETH,
    frameDuration,
    now: BigInt(Math.floor(Date.now() / 1000)),
  });

  if (!state) {
    return null;
  }

  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      type="info"
      description={<QuarantineDescription state={state} />}
    >
      {state.type === 'releasable' && isDappActive && (
        <ApplyButton
          size="xs"
          variant="outlined"
          color="secondary"
          loading={mutation.isPending}
          onClick={applyReport}
        >
          Apply fresh report
        </ApplyButton>
      )}
    </NoticeContainer>
  );
};
