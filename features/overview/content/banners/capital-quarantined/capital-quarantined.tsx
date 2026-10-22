import { isBigint } from 'utils';

import { useVault } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { NoticeContainer } from 'shared/components';

import { useVaultOverview } from 'features/overview/vault-overview';
import { ApplyButton } from '../styles';
import { QuarantineDescription } from './quarantine-description';
import { useApplyQuarantineReport, useOnchainQuarantine } from './hooks';

const DAY = 86400n;
// oracle report usually arrives once a day around 12:00 UTC
const REPORT_TIME_OF_DAY = 12n * 3600n;

// first daily report with timestamp >= endTimestamp releases the quarantine;
// it can't be earlier than the day after the latest report, nor than today
const getExpectedReportTimestamp = (
  hubReportTimestamp: bigint,
  endTimestamp: bigint,
) => {
  const endDay = endTimestamp / DAY;
  const firstDayAfterEnd =
    endDay * DAY + REPORT_TIME_OF_DAY >= endTimestamp ? endDay : endDay + 1n;
  const nextReportDay = hubReportTimestamp / DAY + 1n;
  const today = BigInt(Math.floor(Date.now() / 1000)) / DAY;

  const day = [firstDayAfterEnd, nextReportDay, today].reduce((a, b) =>
    a > b ? a : b,
  );

  return day * DAY + REPORT_TIME_OF_DAY;
};

export const CapitalQuarantined = () => {
  const { activeVault } = useVault();
  const { isDappActive } = useDappStatus();
  const { values } = useVaultOverview();
  const { data: onchainQuarantine, isLoading: isOnchainQuarantineLoading } =
    useOnchainQuarantine();
  const { applyReport, mutation } = useApplyQuarantineReport();

  const hubReportTimestamp = activeVault?.hubReport.timestamp;
  const isReleasable =
    !!activeVault &&
    !activeVault.isReportFresh &&
    activeVault.isReportAvailable &&
    !!onchainQuarantine?.isActive &&
    isBigint(hubReportTimestamp) &&
    hubReportTimestamp >= onchainQuarantine.endTimestamp;

  const { endTimestamp, pendingTotalValueIncrease, totalValueRemainder } =
    (isReleasable ? onchainQuarantine : values?.vaultQuarantineState) ?? {};

  if (
    isOnchainQuarantineLoading ||
    !endTimestamp ||
    !pendingTotalValueIncrease ||
    !isBigint(totalValueRemainder) ||
    !isBigint(hubReportTimestamp)
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      type="info"
      description={
        <QuarantineDescription
          pendingTotalValueIncrease={pendingTotalValueIncrease}
          totalValueRemainder={totalValueRemainder}
          expectedReportTimestamp={getExpectedReportTimestamp(
            hubReportTimestamp,
            endTimestamp,
          )}
          isReleasable={isReleasable}
        />
      }
    >
      {isReleasable && isDappActive && (
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
