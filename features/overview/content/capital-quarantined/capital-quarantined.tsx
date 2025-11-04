import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverviewData } from 'features/overview/hooks';
import { QuarantineDescription } from './quarantine-description';

export const CapitalQuarantined = () => {
  const { data } = useVaultOverviewData();

  if (!data?.vaultQuarantineState.isActive) {
    return null;
  }

  const { endTimestamp, pendingTotalValueIncrease, totalValueRemainder } =
    data.vaultQuarantineState;

  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      type="info"
      description={
        <QuarantineDescription
          pendingTotalValueIncrease={pendingTotalValueIncrease}
          totalValueRemainder={totalValueRemainder}
          timestamp={endTimestamp}
        />
      }
    />
  );
};
