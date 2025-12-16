import { vaultTexts } from 'modules/vaults';

import { NoticeContainer, RepayObligations } from 'features/overview/shared';
import { useVaultOverview } from '../../../vault-overview';

const {
  capacityExceeded: { title, description, note },
} = vaultTexts.metrics;

export const CapacityExceeded = () => {
  const { values } = useVaultOverview();
  const { utilizationRatioNumber, healthFactorNumber } = values ?? {};

  if (
    !utilizationRatioNumber ||
    utilizationRatioNumber <= 100 ||
    (!!healthFactorNumber && healthFactorNumber < 100)
  ) {
    return null;
  }

  return (
    <NoticeContainer title={title} description={description} note={note}>
      <RepayObligations />
    </NoticeContainer>
  );
};
