import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverviewData } from 'features/overview/hooks';
import { QuarantineDescription } from './quarantine-description';

export const CapitalQuarantined = () => {
  const { data } = useVaultOverviewData();

  if (!data?.vaultQuarantineState.isActive) {
    return null;
  }

  const { endTimestamp, pendingTotalValueIncrease } = data.vaultQuarantineState;

  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      description={
        <QuarantineDescription
          amount={pendingTotalValueIncrease}
          timestamp={endTimestamp}
        />
      }
      actions={[]}
    />
  );
};
