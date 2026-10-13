import { vaultTexts } from 'modules/vaults';
import { isNumber } from 'utils';
import { NoticeContainer } from 'shared/components';
import { UTILIZATION_RATIO_THRESHOLD } from 'consts/threshold';

import { RepayObligations } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';

const {
  capacityExceeded: { title, description, note },
} = vaultTexts.metrics;

export const CapacityExceeded = () => {
  const { values } = useVaultOverview();
  const { utilizationRatioNumber, healthFactorNumber } = values ?? {};

  if (
    !isNumber(utilizationRatioNumber) ||
    utilizationRatioNumber < UTILIZATION_RATIO_THRESHOLD ||
    (isNumber(healthFactorNumber) && healthFactorNumber < 100)
  ) {
    return null;
  }

  return (
    <NoticeContainer title={title} description={description} note={note}>
      <RepayObligations />
    </NoticeContainer>
  );
};
