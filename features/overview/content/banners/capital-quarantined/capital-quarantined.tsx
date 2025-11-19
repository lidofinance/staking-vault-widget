import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';
import { QuarantineDescription } from './quarantine-description';

export const CapitalQuarantined = () => {
  const { values } = useVaultOverview();
  const { vaultQuarantineState } = values ?? {};
  const { endTimestamp, pendingTotalValueIncrease, totalValueRemainder } =
    vaultQuarantineState ?? {};

  if (
    !endTimestamp ||
    !pendingTotalValueIncrease ||
    typeof totalValueRemainder !== 'bigint'
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
          timestamp={endTimestamp}
        />
      }
    />
  );
};
